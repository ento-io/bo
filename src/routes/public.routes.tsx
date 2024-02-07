import { createRoute , redirect } from "@tanstack/react-router";

import { z } from "zod";
import { appLayout } from "./routes";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import { getAppCurrentUserSelector } from "@/redux/reducers/app.reducer";
import AuthLayout from "@/pages/auth/AuthLayout";
import { PATH_NAMES } from "@/utils/pathnames";

/**
 * add id to pathless route (sub layouts)
 * @see: https://github.com/TanStack/router/discussions/696
 */
const publicLayout = createRoute({
  id: "public",
  getParentRoute: () => appLayout,
  component: AuthLayout,
  beforeLoad: ({ context }) => {
    const { store } = context;
    if (store) {
      const user = getAppCurrentUserSelector(store.getState());
      if (user) {
        // If the user is logged out, redirect them to the login page
        throw redirect({
          to: "/",
        });
      }

    }
  },
});

const loginRoute = createRoute({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  getParentRoute: () => publicLayout,
  component: Login,
  path: PATH_NAMES.login,
});

const signUpRoute = createRoute({
  getParentRoute: () => publicLayout,
  component: SignUp,
  path: PATH_NAMES.signUp,
});

const publicRoutes = publicLayout.addChildren([loginRoute, signUpRoute]);

export default publicRoutes;
