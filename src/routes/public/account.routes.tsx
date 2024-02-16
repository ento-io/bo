import { Outlet, createRoute } from "@tanstack/react-router";

import { appLayout } from "../routes";
import AuthLayout from "@/pages/auth/AuthLayout";
import { PATH_NAMES } from "@/utils/pathnames";
import ConfirmAccount from "@/pages/auth/ConfirmAccount";
import SendEmailResetPassword from "@/pages/auth/SendEmailResetPassword";

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

// send email reset password and rest password layout
const resetPasswordPublicLayout = createRoute({
  getParentRoute: () => accountPublicLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.account.resetPassword
});

const senEmailResetPasswordRoute = createRoute({
  getParentRoute: () => resetPasswordPublicLayout,
  component: SendEmailResetPassword,
  path: '/',
});

const accountPublicRoutes = accountPublicLayout.addChildren([
  verifyAccountRoute,
  resetPasswordPublicLayout.addChildren([senEmailResetPasswordRoute])
]);

export default accountPublicRoutes;
