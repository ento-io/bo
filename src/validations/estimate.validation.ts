import { z } from 'zod';

import { errorMap } from '@/config/zod';
import { dateForAdvancedSearchSchema } from './app.validations';

export const estimateSchema = z.object({
  url: z
    .string({ errorMap })
    .url()
});

export const estimateFilterSchema = z.object({
  createdAt: dateForAdvancedSearchSchema,
  updatedAt: dateForAdvancedSearchSchema,
  user: z.string().optional(),
  status: z.array(z.string().optional()).optional(),
});