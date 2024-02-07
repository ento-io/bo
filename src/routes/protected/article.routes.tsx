import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import Articles from "../../pages/articles/Articles";
import Article from "../../pages/articles/Article";
import { privateLayout } from "../private.routes";
// import { getArticle, getArticles } from "../../actions/article.actions";
import { IIdParams } from "@/types/app.type";

export const articlesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: "/articles",
});

export const articlesRoute = createRoute({
  getParentRoute: () => articlesLayout,
  // loader: getArticles,
  component: Articles,
  path: "/",
});

export const articleRoute = createRoute({
  parseParams: (params: IIdParams) => ({
    id: z.string().parse(params.id),
  }),
  // loader: ({ params }: { params: IIdParams }) => getArticle(params.id),
  getParentRoute: () => articlesLayout,
  component: Article,
  path: "$id",
});

const articleRoutes = [articlesRoute, articleRoute];

export default articleRoutes;
