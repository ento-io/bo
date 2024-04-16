import { Attributes } from "parse";
import { z } from "zod";
import { invoiceFilterSchema, invoiceSchema } from "@/validations/invoice.validation";
import { IEstimate } from "./estimate.type";
import { IUser } from "./user.type";
import { IFileCloud } from "./file.type";

export enum InvoiceStatusEnum {
  'WAITING' = 'WAITING',
  'IN_PROGRESS' = 'IN_PROGRESS',
  'SENT' =  'SENT',
  'PAID' =  'PAID',
};
export interface IInvoice extends Attributes {
  objectId: string;
  supplierName: string;
  estimate: IEstimate;
  reference: IEstimate['reference'];
  updatedAt?: string;
  createdAt?: string;
  deletedAt?: string;
  updatedBy?: IUser;
  createdBy: IUser;
  deletedBy?: IUser;
  user: IUser;
  file: IFileCloud;
  deleted: boolean;
  status: InvoiceStatusEnum;
}

export interface IInvoiceState {
  loading: boolean;
  invoice: IInvoice | null;
  invoices: IInvoice[];
  count: number;
  filters: Record<string, string | boolean> | null;
  error: string;
}

export interface IInvoiceGenerationBody {
  id: string;
  reference: string;
}


export interface IInvoiceAPIInput extends IInvoiceGenerationBody {
  sessionToken: string;
}

export type EstimateInput = z.infer<typeof invoiceSchema>;
export type EstimateFiltersInput = z.infer<typeof invoiceFilterSchema>;

export type InvoiceInput = z.infer<typeof invoiceSchema>;