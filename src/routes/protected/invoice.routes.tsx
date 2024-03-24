import { Outlet, createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { privateLayout } from "./private.routes";
import { IIdParams } from "@/types/app.type";
import { PATH_NAMES } from "@/utils/pathnames";
import { onEnter } from "@/redux/actions/app.action";
import { onInvoiceEnter, onInvoicesEnter } from "@/redux/actions/invoice.action";
import Invoices from "@/pages/invoices/Invoices";
import Invoice from "@/pages/invoices/Invoice";

export const invoicesLayout = createRoute({
  getParentRoute: () => privateLayout,
  component: () => <Outlet />,
  path: PATH_NAMES.invoices,
});

export const invoicesRoute = createRoute({
  getParentRoute: () => invoicesLayout,
  beforeLoad: onEnter(onInvoicesEnter),
  component: Invoices,
  path: "/",
});

export const invoiceRoute = createRoute({
  parseParams: (params: IIdParams) => ({
    id: z.string().parse(params.id),
  }),
  getParentRoute: () => invoicesLayout,
  beforeLoad: onEnter(onInvoiceEnter),
  component: Invoice,
  path: "$id",
});

const invoiceRoutes = [invoicesRoute, invoiceRoute];

export default invoiceRoutes;
