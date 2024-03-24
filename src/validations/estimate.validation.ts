import { z } from 'zod';

import { errorMap } from '@/config/zod';

export const estimateSchema = z.object({
  url: z
    .string({ errorMap })
    .url()
});

export const estimateFilterSchema = estimateSchema;