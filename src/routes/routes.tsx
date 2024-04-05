import {
  createRouter,
  Outlet,
  createRootRouteWithContext,
  createRoute,
 redirect, 
 notFound} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { IRouteContext } from "@/types/app.type";
import authPublicRoutes from "./public/auth.routes";
import privateRoutes from "./protected/private.routes";
import { PATH_NAMES } from "@/utils/pathnames";
import { logout } from "@/redux/actions/auth.action";
import accountPublicRoutes from "./public/account.routes";
import NotFoundPage from "@/pages/NotFoundPage";

export const appLayout = createRootRouteWithContext<IRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  notFoundComponent: () => (
    <NotFoundPage />
  )
});

const logoutRoute = createRoute({
  path: PATH_NAMES.logout,
  getParentRoute: () => appLayout,
  component: () => <>..Loading</>,
  beforeLoad: async ({ context }) => {
    const { store } = context;
    if (store) {
      await store.dispatch(logout());
      // If the user is logged out, redirect them to the login page
      throw redirect({
        to: PATH_NAMES.login,
        replace: true,
      });
    }
  },
});

/**
 * we need this route to navigate to 404 page
 * so we can redirect to 404 page in page or actions (onEnter) using useNavigate (instead of throwing error)
 */
export const notFoundRoute = createRoute({
  path: PATH_NAMES.notFound,
  getParentRoute: () => appLayout,
  beforeLoad: async () => {
    const redirect = true;
    if (redirect) {
      throw notFound();
    }
    return null;
  },
  component: () => null,
});

const routeTree = appLayout.addChildren([
  authPublicRoutes,
  accountPublicRoutes,
  privateRoutes,
  logoutRoute,
  notFoundRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    store: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
});
export default router;
