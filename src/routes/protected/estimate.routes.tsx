import { Outlet, createRoute } from "@tanstack/react-router";

import { privateLayout } from "./private.routes";
import { PATH_NAMES } from "@/utils/pathnames";
import Estimates from "@/pages/estimates/Estimates";

export const estimatesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.estimates,
});

export const estimatesRoute = createRoute({
  getParentRoute: () => estimatesLayout,
  // beforeLoad: onEnter(onArticlesEnter),
  component: Estimates,
  path: "/",
});

const estimateRoutes = [estimatesRoute];

export default estimateRoutes;
