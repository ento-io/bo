import { object, string } from 'zod';

import { createManyUnion } from '@/config/zod';
import { readOnlyLocales } from '@/config/i18n';

export const langSchema = createManyUnion(readOnlyLocales as typeof readOnlyLocales & [string, string, ...string[]]);

export const settingsSchema = object({
  lang: langSchema,
});

export const confirmDeletionSchema = object({
  confirmation: string(),
});

export const selectOptionSchema = object({
  label: string().nullable(),
  value: string().nullable(),
});

export const getSelectOptionSchema = (nullable = true): any => {
  const option = object({
    label: string().nullable(),
    value: nullable ? string().nullable() : string(),
  });

  return option;
};
