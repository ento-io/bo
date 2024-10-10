import { z } from 'zod';
import { createManyUnion } from '@/config/zod';
import { readOnlyLocales } from '@/config/i18n';

export const langSchema = createManyUnion(readOnlyLocales as typeof readOnlyLocales & [string, string, ...string[]]);
export const dateForAdvancedSearchSchema = z.array(z.coerce.date().nullable()).optional();

export const settingsSchema = z.object({
  lang: langSchema,
});

export const ordersSchema = z.object({
  lang: langSchema,
});

export const confirmDeletionSchema = z.object({
  confirmation: z.string(),
});

export const selectOptionSchema = z.object({
  label: z.string().nullable(),
  value: z.string().nullable(),
});

export const getSelectOptionSchema = (nullable = true): any => {
  const option = z.object({
    label: z.string().nullable(),
    value: nullable ? z.string().nullable() : z.string(),
  });

  return option;
};

export const tabRouteSearchParams = z.object({
  tab: z.string().optional(),
});

export const tabAndCategoryRouteSearchParams = tabRouteSearchParams.extend({
  category: z.string().optional(),
});

export const autoCompleteOptionSchema = z.object({
  label: z.string(),
  value: z.record(z.string(), z.string()),
});