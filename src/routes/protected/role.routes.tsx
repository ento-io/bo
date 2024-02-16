import { createRoute } from "@tanstack/react-router";

import { privateLayout } from "./app.routes";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onRolesEnter } from "@/redux/actions/role.action";
import Roles from "@/pages/Roles";

const rolesRoute = createRoute({
  getParentRoute: () => privateLayout,
  loader: onEnter(onRolesEnter),
  component: Roles,
  path: PATH_NAMES.roles,
});

export default rolesRoute;
