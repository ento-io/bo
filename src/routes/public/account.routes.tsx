import { Outlet, createRoute } from "@tanstack/react-router";

import { z } from "zod";
import { appLayout } from "../routes";
import AuthLayout from "@/pages/auth/AuthLayout";
import { PATH_NAMES } from "@/utils/pathnames";
import ConfirmAccount from "@/pages/auth/ConfirmAccount";
import SendEmailResetPassword from "@/pages/auth/SendEmailResetPassword";
import { onEnter } from "@/redux/actions/app.action";
import { onEnterResetPassword, onEnterSendResetPasswordEmail } from "@/redux/actions/auth.action";
import ConfirmResetPasswordCodeSentByEmail from "@/pages/auth/ConfirmResetPasswordCodeSentByEmail";
import ResetPassword from "@/pages/auth/ResetPassword";

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

const codeToResetPasswordAccountRoute = createRoute({
  getParentRoute: () => accountPublicLayout,
  component: ConfirmResetPasswordCodeSentByEmail,
  path: PATH_NAMES.account.confirmResetPasswordCode,
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
  beforeLoad: onEnter(onEnterSendResetPasswordEmail),
  path: '/',
});

const resetPasswordRoute = createRoute({
  parseParams: (params: { email: string }) => ({
    email: z.string().parse(params.email), // string because it's encrypted email
  }),
  getParentRoute: () => resetPasswordPublicLayout,
  beforeLoad: onEnter(onEnterResetPassword),
  component: ResetPassword,
  path: '/$email',
});

const accountPublicRoutes = accountPublicLayout.addChildren([
  verifyAccountRoute,
  codeToResetPasswordAccountRoute,
  resetPasswordPublicLayout.addChildren([senEmailResetPasswordRoute, resetPasswordRoute])
]);

export default accountPublicRoutes;
