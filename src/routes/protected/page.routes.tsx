import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import Pages from "../../pages/pages/Pages";
import Page from "../../pages/pages/Page";
import { privateLayout } from "./private.routes";
import { IIdParams } from "@/types/app.type";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onPageEnter, onPagesEnter, onCreatePageEnter, onEditPageEnter } from "@/redux/actions/page.action";
import CreatePage from "@/pages/pages/CreatePage";
import EditPage from "@/pages/pages/EditPage";
import { tabAndCategoryRouteSearchParams } from "@/validations/app.validations";
import CMSFormLayout from "@/containers/cms/CMSFormLayout";
import EditPageBlocks from "@/pages/pages/blocks/EditPageBlocks";
import CreatePageBlocks from "@/pages/pages/blocks/CreatePageBlocks";
import { onAddPageBlocksEnter, onEditPageBlocksEnter } from "@/redux/actions/pageBlock.action";

export const pagesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.pages,
});

export const pagesRoute = createRoute({
  validateSearch: (search) => tabAndCategoryRouteSearchParams.parse(search),
  getParentRoute: () => pagesLayout,
  beforeLoad: onEnter(onPagesEnter),
  component: Pages,
  path: "/",
});

export const pageFormLayout = createRoute({
  id: "page",
  getParentRoute: () => pagesLayout,
  component: CMSFormLayout,
});

export const pageRoute = createRoute({
  parseParams: (params: IIdParams) => ({
    id: z.string().parse(params.id),
  }),
  beforeLoad: onEnter(onPageEnter),
  getParentRoute: () => pagesLayout,
  component: Page,
  path: "$id",
});

export const editPageRoute = createRoute({
  parseParams: (params: any) => ({
    id: z.string().parse(params.id),
  }),
  path: `$id/${PATH_NAMES.edit}`,
  beforeLoad: onEnter(onEditPageEnter),
  getParentRoute: () => pageFormLayout,
  component: EditPage,
});

export const createPageBlocksRoute = createRoute({
  parseParams: (params: any) => ({
    pageId: z.string().parse(params.pageId),
  }),
  path: `$pageId/${PATH_NAMES.blocks}/${PATH_NAMES.create}`,
  beforeLoad: onEnter(onAddPageBlocksEnter),
  getParentRoute: () => pageFormLayout,
  component: CreatePageBlocks,
});

export const editPageBlocksRoute = createRoute({
  parseParams: (params: any) => ({
    pageId: z.string().parse(params.pageId),
  }),
  path: `$pageId/${PATH_NAMES.blocks}/${PATH_NAMES.edit}`,
  beforeLoad: onEnter(onEditPageBlocksEnter),
  getParentRoute: () => pageFormLayout,
  component: EditPageBlocks,
});

export const createPageRoute = createRoute({
  path: PATH_NAMES.create,
  beforeLoad: onEnter(onCreatePageEnter),
  getParentRoute: () => pageFormLayout,
  component: CreatePage,
});

const pageRoutes = [
  pagesRoute,
  pageRoute,
  pageFormLayout.addChildren([
    createPageRoute,
    editPageRoute,
    // page blocks
    createPageBlocksRoute,
    editPageBlocksRoute,
  ])
];

export default pageRoutes;
