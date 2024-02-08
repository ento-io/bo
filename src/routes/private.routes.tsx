import { createRoute , redirect } from "@tanstack/react-router";
import Parse from "parse";
import DashboardLayout from "@/pages/DashboardLayout";

import { appLayout } from "./routes";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import articleRoutes, { articlesLayout } from "./protected/article.routes";
import { PATH_NAMES } from "@/utils/pathnames";
import Settings from "@/pages/Settings";
import { checkSession } from "@/redux/actions/auth.action";

/**
 * add id to pathless route (sub layouts)
 * @see: https://github.com/TanStack/router/discussions/696
 */
export const privateLayout = createRoute({
  id: "private",
  getParentRoute: () => appLayout,
  component: DashboardLayout,
  beforeLoad: async ({ context, location }) => {
    const { store } = context;
    // check if there is user and if the session is still valid before entering the dashboard
    await store?.dispatch(checkSession());
    if (store) {
      const user = await Parse.User.currentAsync();
      if (!user) {
        // If the user is logged out, redirect them to the login page
        // NOTE: redirect is only available in beforeLoad and loader (not in component or in action)
        throw redirect({
          to: PATH_NAMES.login,
            search: {
            // Use the current location to power a redirect after login
            // (Do not use `router.state.resolvedLocation` as it can
            // potentially lag behind the actual current location)
            redirect: location.href,
          },
        });
      }
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => privateLayout,
  component: Home,
  path: "/",
});

const profileRoute = createRoute({
  getParentRoute: () => privateLayout,
  component: Profile,
  path: PATH_NAMES.profile,
});

const settingsRoute = createRoute({
  getParentRoute: () => privateLayout,
  component: Settings,
  path: PATH_NAMES.settings,
});

const privateRoutes = privateLayout.addChildren([
  homeRoute,
  // use addChildren in the root because of type errors
  articlesLayout.addChildren(articleRoutes),
  profileRoute,
  settingsRoute
]);

export default privateRoutes;
