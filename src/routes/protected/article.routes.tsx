import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import Articles from "../../pages/articles/Articles";
import Article from "../../pages/articles/Article";
import { privateLayout } from "./private.routes";
import { IIdParams } from "@/types/app.type";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onArticleEnter, onArticlesEnter, onCreateArticleEnter, onEditArticleEnter } from "@/redux/actions/article.action";
import CreateArticle from "@/pages/articles/CreateArticle";
import EditArticle from "@/pages/articles/EditArticle";
import { tabAndCategoryRouteSearchParams } from "@/validations/app.validations";
import ArticleFormLayout from "@/containers/articles/ArticleFormLayout";

export const articlesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.articles,
});

export const articlesRoute = createRoute({
  validateSearch: (search) => tabAndCategoryRouteSearchParams.parse(search),
  getParentRoute: () => articlesLayout,
  beforeLoad: onEnter(onArticlesEnter),
  component: Articles,
  path: "/",
});

export const articleFormLayout = createRoute({
  id: "article",
  getParentRoute: () => articlesLayout,
  component: ArticleFormLayout,
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

export const editArticleRoute = createRoute({
  parseParams: (params: any) => ({
    id: z.string().parse(params.id),
  }),
  path: `$id/${PATH_NAMES.edit}`,
  beforeLoad: onEnter(onEditArticleEnter),
  getParentRoute: () => articleFormLayout,
  component: EditArticle,
});

export const createArticleRoute = createRoute({
  path: PATH_NAMES.create,
  beforeLoad: onEnter(onCreateArticleEnter),
  getParentRoute: () => articleFormLayout,
  component: CreateArticle,
});

// export const articleRoute = createRoute({
//   parseParams: (params: IIdParams) => ({
//     id: z.string().parse(params.id),
//   }),
//   beforeLoad: onEnter(onArticleEnter),
//   getParentRoute: () => articlesLayout,
//   component: Article,
//   path: "$id",
// });

const articleRoutes = [
  articlesRoute,
  articleRoute,
  articleFormLayout.addChildren([
    createArticleRoute,
    editArticleRoute,
  ])
];

export default articleRoutes;
