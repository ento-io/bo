
import { capitalize } from 'string-ts';
import { z } from 'zod';
import i18n, { locales } from '@/config/i18n';
import { DEFAULT_LANGUAGE } from '@/utils/constants';
import { formatTranslatedFormValuesToSave } from '@/utils/cms.utils';
import { errorMap } from '@/config/zod';
import { dateForAdvancedSearchSchema } from './app.validations';
import { getSingleImageSchema } from './file.validation';
import { CategoryEntityEnum } from '@/types/category.type';

const getTranslatedSchema = () => {
  const translatedSchema: Record<string, any> = {};

  locales.forEach((locale: string) => {
    // ------------------------------------ //
    // ----- optional for all locales ----- //
    // ------------------------------------ //

    // slug
    translatedSchema[locale + ':slug'] = z.string({ errorMap }).max(
      100,
      i18n.t('form.error.max', { field: 'Slug', number: 100 }),
    );
    // tags
    translatedSchema[locale + ':tags'] = z.string({ errorMap }).max(
      200,
      i18n.t('form.error.max', { field: 'Tags', number: 200 }),
    );

    // ------------------------------------ //
    // - required only for default locale - //
    // ------------------------------------ //
    if (locale !== DEFAULT_LANGUAGE) {
      translatedSchema[locale + ':name'] = z.string({ errorMap }).transform((value: string): string =>
        value ? capitalize(value) : '',
      );
      // default locale should be required
    } else {
      translatedSchema[DEFAULT_LANGUAGE + ':name'] = z.string({ errorMap })
        .min(1, i18n.t('form.error.required', { field: i18n.t('cms:page') }))
        .transform(capitalize);
    }
  });

  return translatedSchema;
};

export const categorySchema = z.object({
  active: z.boolean(),
  entity: z.nativeEnum(CategoryEntityEnum, { required_error: i18n.t('form.error.required', { field: i18n.t('cms:category.category') }) }),
  image: getSingleImageSchema(),
  ...getTranslatedSchema(),
}).transform(formatTranslatedFormValuesToSave);

export const categoryFilterSchema = z.object({
  createdAt: dateForAdvancedSearchSchema,
  updatedAt: dateForAdvancedSearchSchema,
  user: z.string().optional(),
  entity: z.string().optional(),
  active: z.array(z.boolean().optional()).optional(),
});

export const categoryOptionSchema = z.object({
  label: z.string(),
  value: z.object({
    objectId: z.string(),
  }),
}).transform((value) => {
  return value.value.objectId;
});