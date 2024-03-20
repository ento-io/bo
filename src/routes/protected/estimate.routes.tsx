import { Outlet, createRoute } from "@tanstack/react-router";

import { privateLayout } from "./private.routes";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import Estimates from "@/pages/estimates/Estimates";
import Estimate from "@/pages/estimates/Estimate";
import { onEstimatesEnter } from "@/redux/actions/estimate.action";

export const estimatesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.estimates,
});

export const estimatesRoute = createRoute({
  getParentRoute: () => estimatesLayout,
  beforeLoad: onEnter(onEstimatesEnter),
  component: Estimates,
  path: "/",
});

export const estimateRoute = createRoute({
  getParentRoute: () => estimatesLayout,
  // beforeLoad: onEnter(onArticleEnter),
  component: Estimate,
  path: "$id",
});

const estimateRoutes = [estimatesRoute, estimateRoute];

export default estimateRoutes;
