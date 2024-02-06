import {
  createRouter,
  createRootRoute,
  Outlet,
 createRoute } from "@tanstack/react-router";
import AppLayout from "@/pages/AppLayout";
// import DashboardLayoutRoutes from "./protected/dashboard.routes";
import AuthLayoutRoutes from "./public/public.routes";

import DashboardLayout from "@/pages/DashboardLayout";


const DashboardLayoutRoutes = createRootRoute({
  component: DashboardLayout,
});

// DashboardLayoutRoutes.addChildren([HomeRoute]);

const routeTree = DashboardLayoutRoutes.addChildren([DashboardLayoutRoutes]);
// const routeTree = AppLayoutRoutes.addChildren([DashboardLayoutRoutes, AuthLayoutRoutes]);

const router = createRouter({ routeTree, defaultPreload: "intent" });
export default router;
