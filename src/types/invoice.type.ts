import { Attributes } from "parse";
import { z } from "zod";
import { invoiceFilterSchema, invoiceSchema } from "@/validations/invoice.validation";
import { IEstimate } from "./estimate.types";
import { IUser } from "./user.type";

export interface IInvoice extends Attributes {
  objectId: string;
  estimate: IEstimate;
  updatedAt?: string;
  createdAt?: string;
  updatedBy?: IUser;
  createdBy: IUser;
  deletedBy?: IUser;
}

export interface IInvoiceState {
  loading: boolean;
  invoice: IInvoice | null;
  invoices: IInvoice[];
  count: number;
  filters: Record<string, string | boolean> | null;
}

export type EstimateInput = z.infer<typeof invoiceSchema>;
export type EstimateFiltersInput = z.infer<typeof invoiceFilterSchema>;

export type InvoiceInput = z.infer<typeof invoiceSchema>;