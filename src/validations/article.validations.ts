import { z } from "zod";
import { dateForAdvancedSearchSchema } from "./app.validations";

export const articleSchema = z.object({
  title: z.string().min(1, { message: 'Title required' }),
});

export const articleFilterSchema = z.object({
  createdAt: dateForAdvancedSearchSchema,
  updatedAt: dateForAdvancedSearchSchema,
  user: z.string().optional(),
  status: z.array(z.string().optional()).optional(),
});