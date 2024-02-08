import {
  createRouter,
  Outlet,
  createRootRouteWithContext,
  createRoute,
 redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { IRouteContext } from "@/types/app.type";
import publicRoutes from "./public.routes";
import privateRoutes from "./private.routes";
import { PATH_NAMES } from "@/utils/pathnames";
import { logout } from "@/redux/actions/auth.action";


export const appLayout = createRootRouteWithContext<IRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  notFoundComponent: () => {
    return <p>page not found!  (not cool this page design, right? 😁)</p>
  },
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

const routeTree = appLayout.addChildren([
  publicRoutes,
  privateRoutes,
  logoutRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    store: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
});
export default router;
