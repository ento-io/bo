import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import AuthLayout from "@/pages/auth/AuthLayout";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import LogOut from "@/pages/auth/LogOut";

const AuthLayoutRoutes = createRootRoute({
  component: AuthLayout,
});

const LoginRoute = createRoute({
  getParentRoute: () => AuthLayoutRoutes,
  component: Login,
  path: "/login",
});

const SignUpRoute = createRoute({
  getParentRoute: () => AuthLayoutRoutes,
  component: SignUp,
  path: "/signup",
});

const LogoutRoute = createRoute({
  getParentRoute: () => AuthLayoutRoutes,
  component: LogOut,
  path: "/logout",
});

const routeTree = AuthLayoutRoutes.addChildren([LoginRoute, SignUpRoute, LogoutRoute]);

const publicRouter = createRouter({ routeTree, defaultPreload: "intent" });
export default publicRouter;
