import { z } from "zod";
import { invoiceSchema } from "@/validations/invoice.validation";

export type InvoiceInput = z.infer<typeof invoiceSchema>;