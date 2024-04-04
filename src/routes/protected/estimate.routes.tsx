import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { privateLayout } from "./private.routes";
import { IIdParams } from "@/types/app.type";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onEstimateEnter, onEstimatesEnter } from "@/redux/actions/estimate.action";
import Estimates from "@/pages/estimates/Estimates";
import Estimate from "@/pages/estimates/Estimate";

export const estimatesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.estimates,
});

export const estimatesRoute = createRoute({
  validateSearch: (search) => z.object({
    tab: z.string().optional(),
  }).parse(search),
  getParentRoute: () => estimatesLayout,
  beforeLoad: onEnter(onEstimatesEnter),
  component: Estimates,
  path: "/",
});

export const estimateRoute = createRoute({
  parseParams: (params: IIdParams) => ({
    id: z.string().parse(params.id),
  }),
  getParentRoute: () => estimatesLayout,
  beforeLoad: onEnter(onEstimateEnter),
  component: Estimate,
  path: "$id",
});

const estimateRoutes = [estimatesRoute, estimateRoute];

export default estimateRoutes;
