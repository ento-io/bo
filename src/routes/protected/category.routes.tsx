import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { privateLayout } from "./private.routes";
import { IIdParams } from "@/types/app.type";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onCategoryEnter, onCategoriesEnter } from "@/redux/actions/category.action";
import Categories from "@/pages/categories/Categories";
import Category from "@/pages/categories/Category";

export const categoriesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.categories,
});

export const categoriesRoute = createRoute({
  validateSearch: (search) => z.object({
    tab: z.string().optional(),
  }).parse(search),
  getParentRoute: () => categoriesLayout,
  beforeLoad: onEnter(onCategoriesEnter),
  component: Categories,
  path: "/",
});

export const categoryRoute = createRoute({
  parseParams: (params: IIdParams) => ({
    id: z.string().parse(params.id),
  }),
  getParentRoute: () => categoriesLayout,
  beforeLoad: onEnter(onCategoryEnter),
  component: Category,
  path: "$id",
});

const categoryRoutes = [categoriesRoute, categoryRoute];

export default categoryRoutes;
