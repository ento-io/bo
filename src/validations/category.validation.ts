
import { capitalize } from 'string-ts';
import { z } from 'zod';
import i18n, { locales } from '@/config/i18n';
import { DEFAULT_LANGUAGE } from '@/utils/constants';
import { formatTranslatedFormValuesToSave } from '@/utils/cms.utils';
import { errorMap } from '@/config/zod';
import { dateForAdvancedSearchSchema } from './app.validations';

const getTranslatedSchema = () => {
  const translatedSchema: Record<string, any> = {};

  locales.forEach((locale: string) => {
    // ------------------------------------ //
    // ----- optional for all locales ----- //
    // ------------------------------------ //

    // // slug
    // translatedSchema['slug+' + locale] = z.string({ errorMap }).max(
    //   100,
    //   i18n.t('form.error.max', { field: 'Slug', number: 100 }),
    // );
    // // tags
    // translatedSchema['tags+' + locale] = z.string({ errorMap }).max(
    //   200,
    //   i18n.t('form.error.max', { field: 'Tags', number: 200 }),
    // );

    //

    // ------------------------------------ //
    // - required only for default locale - //
    // ------------------------------------ //
    if (locale !== DEFAULT_LANGUAGE) {
      translatedSchema['name+' + locale] = z.string({ errorMap }).transform((value: string): string =>
        value ? capitalize(value) : '',
      );
      // default locale should be required
    } else {
      translatedSchema['name+' + DEFAULT_LANGUAGE] = z.string({ errorMap })
        .min(1, i18n.t('form.error.required', { field: i18n.t('page:page') }))
        .transform(capitalize);
    }
  });

  return translatedSchema;
};

export const categorySchema = z.object({
  active: z.boolean(),
  ...getTranslatedSchema(),
}).transform(formatTranslatedFormValuesToSave);

export const categoryFilterSchema = z.object({
  createdAt: dateForAdvancedSearchSchema,
  updatedAt: dateForAdvancedSearchSchema,
  user: z.string().optional(),
});