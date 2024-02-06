import {
  createRootRoute,
  createRoute, createRouter,
} from "@tanstack/react-router";
import DashboardLayout from "../../pages/DashboardLayout";
import Home from "../../pages/Home";

const DashboardLayoutRoutes = createRootRoute({
  component: DashboardLayout,
});

const HomeRoute = createRoute({
  getParentRoute: () => DashboardLayoutRoutes,
  component: Home,
  // component: Home,
  path: "/",
});

// const AboutRoute = createRoute({
//   getParentRoute: () => DashboardLayoutRoutes,
//   component: About,
//   path: "/about",
// });

const routeTree = DashboardLayoutRoutes.addChildren([HomeRoute]);
// DashboardLayoutRoutes.addChildren([HomeRoute, AuthLayoutRoute, ArticleLayoutRoutes, AboutRoute]);
const publicRouter = createRouter({ routeTree, defaultPreload: "intent" });
export default publicRouter;
