import { createRoute } from "@tanstack/react-router";
import Articles from "@/pages/articles/Articles";
import Article from "@/pages/articles/Article";
// eslint-disable-next-line import/no-cycle
import DashboardLayoutRoutes from "./private.routes";
import ArticlesLayout from "@/pages/articles/ArticleLayout";

const ArticleLayoutRoutes = createRoute({
  getParentRoute: () => DashboardLayoutRoutes,
  component: ArticlesLayout,
  path: "/articles",
});

const ArticlesRoute = createRoute({
  getParentRoute: () => ArticleLayoutRoutes,
  component: Articles,
  path: "/",
});

export const ArticleRoute = createRoute({
  getParentRoute: () => ArticleLayoutRoutes,
  component: Article,
  path: "$id",
  // loader: (params) => console.log(params),
});

export const EditArticleRoute = createRoute({
  getParentRoute: () => ArticleLayoutRoutes,
  component: Article,
  path: "$id/edit",
  // loader: (params) => console.log(params),
});

ArticleLayoutRoutes.addChildren([ArticlesRoute, ArticleRoute, EditArticleRoute]);

export default ArticleLayoutRoutes;
