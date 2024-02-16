import { createRoute , redirect } from "@tanstack/react-router";

import Parse from "parse";
import { z } from "zod";
import { appLayout } from "../routes";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import AuthLayout from "@/pages/auth/AuthLayout";
import { PATH_NAMES } from "@/utils/pathnames";

/**
 * add id to pathless route (sub layouts)
 * @see: https://github.com/TanStack/router/discussions/696
 */
const authPublicLayout = createRoute({
  id: "public",
  getParentRoute: () => appLayout,
  component: AuthLayout,
  beforeLoad: async ({ context, location }) => {
    // If the user is logged in, redirect them to the home page
    // only in signup and login page
    if ([PATH_NAMES.login, PATH_NAMES.signUp].includes(location.pathname)) {
      const { store } = context;
      if (store) {
        const user = await Parse.User.currentAsync();
        if (user) {
          // If the user is logged out, redirect them to the login page
          throw redirect({
            to: "/",
            replace: true,
          });
        }
      }
    }
  },
});

const loginRoute = createRoute({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  getParentRoute: () => authPublicLayout,
  component: Login,
  path: PATH_NAMES.login,
});

const signUpRoute = createRoute({
  getParentRoute: () => authPublicLayout,
  component: SignUp,
  path: PATH_NAMES.signUp,
});

const authPublicRoutes = authPublicLayout.addChildren([loginRoute, signUpRoute]);

export default authPublicRoutes;
