import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { privateLayout } from "../private.routes";
import { IIdParams } from "@/types/app.type";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onUserEnter, onUsersEnter } from "@/redux/actions/user.action";
import Users from "@/pages/users/Users";
import User from "@/pages/users/User";

export const usersLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.users,
});

export const usersRoute = createRoute({
  getParentRoute: () => usersLayout,
  loader: onEnter(onUsersEnter()),
  component: Users,
  path: "/",
});

export const userRoute = createRoute({
  parseParams: (params: IIdParams) => ({
    id: z.string().parse(params.id),
  }),
  getParentRoute: () => usersLayout,
  loader: onEnter(onUserEnter),
  component: User,
  path: "$id",
});

const userRoutes = [usersRoute, userRoute];

export default userRoutes;