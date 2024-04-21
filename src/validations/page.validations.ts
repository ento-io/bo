import { z } from "zod";
import { capitalize } from "string-ts";
import { articleFilterSchema, cmsSchema, emptyContent, getCMSTranslatedSchema } from "./article.validations";
import { formatTranslatedFormValuesToSave, formatTranslatedPageFormValuesToSave } from "@/utils/cms.utils";
import { categoryOptionSchema } from "./category.validation";
import { CategoryEntityEnum } from "@/types/category.type";
import i18n, { locales } from "@/config/i18n";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import { errorMap } from '@/config/zod';

export const pageFilterSchema = articleFilterSchema.extend({
  metaTitle: z.string().optional(),
});

/**
 * each translated fields of a block
 * ex: { 'fr:name': 'xxx', 'en:name': 'yyy' }
 * @returns 
 */
const getTranslatedBlockSchema = () => {
  const translatedSchema: Record<string, any> = {};

  for (const locale of locales) {
    if (locale !== DEFAULT_LANGUAGE) {
      // ex: fr:title field name
      translatedSchema[locale + ':title'] = z.string({ errorMap }).transform(capitalize);
      translatedSchema[locale + ':description'] = z.string({ errorMap });
      translatedSchema[locale + ':content'] = z.string({ errorMap }).optional().transform(emptyContent);

    } else {
      // required fields only for default locale
      [
        {
        key: 'title',
        label: i18n.t('cms:titleOfEachBlock'),
      },
      {
        key: 'description',
        label: i18n.t('common:description'),
      },
      {
        key: 'content',
        label: i18n.t('common:content'),
      }
    ].forEach(({ key, label }) => {
          translatedSchema[locale + ':' + key] = z.string({ errorMap })
            .min(1, i18n.t('form.error.required', { field: label }))
            .max(250, i18n.t('form.error.max', { field: label, number: 250 }))
            .transform(capitalize)
      });
    }
  }
  return translatedSchema
}

export const pageSchema = cmsSchema
  .extend({
    ...getCMSTranslatedSchema(CategoryEntityEnum.Page), // translated fields
    // optional category
    category: z.preprocess(
      // ISSUE: https://stackoverflow.com/questions/74256866/validating-optional-fields-in-react-using-zod
      (value) => value === '' ? undefined : value,
      categoryOptionSchema.optional()),
    // ex: [{ 'fr:name': 'xxx', 'en:name': 'yyy' }, { 'fr:name': 'xxx', 'en:name': 'yyy' }]
  })
  .transform(formatTranslatedFormValuesToSave);

export const pageBlocksSchema = z.object({
    blocks: z.array(z.object(getTranslatedBlockSchema())).optional()
  })
  .transform(formatTranslatedPageFormValuesToSave);