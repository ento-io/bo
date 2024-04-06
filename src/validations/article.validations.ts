import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, { message: 'Title required' }),
});