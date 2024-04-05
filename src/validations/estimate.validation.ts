import { z } from 'zod';

import { errorMap } from '@/config/zod';

export const estimateSchema = z.object({
  url: z
    .string({ errorMap })
    .url()
});

export const estimateFilterSchema = z.object({
  createdAt: z.array(z.coerce.date().nullable()).optional(),
  updatedAt: z.array(z.coerce.date().nullable()).optional(),
  user: z.string().optional(),
  status: z.array(z.string().optional()).optional(),
});