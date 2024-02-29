import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import Articles from "../../pages/articles/Articles";
import Article from "../../pages/articles/Article";
import { privateLayout } from "./private.routes";
// import { getArticle, getArticles } from "../../actions/article.actions";
import { IIdParams } from "@/types/app.type";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onArticleEnter, onArticlesEnter } from "@/redux/actions/article.action";

export const articlesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.articles,
});

export const articlesRoute = createRoute({
  getParentRoute: () => articlesLayout,
  beforeLoad: onEnter(onArticlesEnter),
  component: Articles,
  path: "/",
});

export const articleRoute = createRoute({
  parseParams: (params: IIdParams) => ({
    id: z.string().parse(params.id),
  }),
  beforeLoad: onEnter(onArticleEnter),
  getParentRoute: () => articlesLayout,
  component: Article,
  path: "$id",
});

const articleRoutes = [articlesRoute, articleRoute];

export default articleRoutes;
