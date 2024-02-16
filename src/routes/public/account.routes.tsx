import { createRoute } from "@tanstack/react-router";

import { appLayout } from "../routes";
import AuthLayout from "@/pages/auth/AuthLayout";
import { PATH_NAMES } from "@/utils/pathnames";
import ConfirmAccount from "@/pages/auth/ConfirmAccount";

/**
 * add id to pathless route (sub layouts)
 * @see: https://github.com/TanStack/router/discussions/696
 */
const accountPublicLayout = createRoute({
  getParentRoute: () => appLayout,
  component: AuthLayout,
  path: PATH_NAMES.account.root
});

const verifyAccountRoute = createRoute({
  getParentRoute: () => accountPublicLayout,
  component: ConfirmAccount,
  path: PATH_NAMES.account.verifyAccount,
});

const accountPublicRoutes = accountPublicLayout.addChildren([verifyAccountRoute]);

export default accountPublicRoutes;
