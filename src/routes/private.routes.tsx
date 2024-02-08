import { createRoute , redirect } from "@tanstack/react-router";
import DashboardLayout from "../pages/DashboardLayout";

import { appLayout } from "./routes";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import articleRoutes, { articlesLayout } from "./protected/article.routes";
import { getAppCurrentUserSelector } from "@/redux/reducers/app.reducer";
import { PATH_NAMES } from "@/utils/pathnames";
import Settings from "@/pages/Settings";

/**
 * add id to pathless route (sub layouts)
 * @see: https://github.com/TanStack/router/discussions/696
 */
export const privateLayout = createRoute({
  id: "private",
  getParentRoute: () => appLayout,
  component: DashboardLayout,
  beforeLoad: ({ context, location }) => {
    const { store } = context;
    if (store) {
      const user = getAppCurrentUserSelector(store.getState());
      if (!user) {
        // If the user is logged out, redirect them to the login page
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
