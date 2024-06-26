import { z } from "zod";
import { capitalize } from "string-ts";
import { articleFilterSchema, cmsSchema, emptyContent, getCMSTranslatedSchema } from "./article.validations";
import { formatTranslatedFormValuesToSave, formatTranslatedPageFormValuesToSave } from "@/utils/cms.utils";
import { categoryOptionSchema } from "./category.validation";
import { CategoryEntityEnum } from "@/types/category.type";
import i18n, { locales } from "@/config/i18n";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import { errorMap } from '@/config/zod';
import { getSingleImageSchema } from "./file.validation";

export const pageFilterSchema = articleFilterSchema.extend({
  metaTitle: z.string().optional(),
});

/**
 * each translated fields of a block
 * ex: { 'fr:name': 'xxx', 'en:name': 'yyy' }
 * @returns 
 */
const getTranslatedBlockSchema = (): Record<string, any> => {
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
        min: 1,
      },
      {
        key: 'description',
        label: i18n.t('common:description'),
      },
      {
        key: 'content',
        label: i18n.t('common:content'),
        max: 500,
      }
    ].forEach(({ key, label, min, max }) => {
      const stringSchema = z.string({ errorMap });

      if (min) {
        stringSchema.min(min, i18n.t('form.error.required', { field: label }));
      }
      if (max) {
        stringSchema.max(max, i18n.t('form.error.max', { field: label, number: max }));
      }
      
      translatedSchema[locale + ':' + key] = stringSchema.transform(capitalize)
      });
    }
  }
  return translatedSchema
}

const getTranslatedPageBlockSchema = (): Record<string, any> => {
  const translatedSchema: Record<string, any> = {};

  for (const locale of locales) {
    if (locale !== DEFAULT_LANGUAGE) {
      // ex: fr:title field name
      translatedSchema[locale + ':blocksTitle'] = z.string({ errorMap }).transform(capitalize);
      translatedSchema[locale + ':blocksDescription'] = z.string({ errorMap }).optional().transform(emptyContent);

    } else {
      // required fields only for default locale
      [
        {
        key: 'blocksTitle',
        label: i18n.t('cms:blocksTitle'),
        min: 1,
      },
      {
        key: 'blocksDescription',
        label: i18n.t('common:blocksDescription'),
        max: 300,
      },
    ].forEach(({ key, label, min, max }) => {
      const stringSchema = z.string({ errorMap });

      if (min) {
        stringSchema.min(min, i18n.t('form.error.required', { field: label }));
      }
      if (max) {
        stringSchema.max(max, i18n.t('form.error.max', { field: label, number: max }));
      }
      
      translatedSchema[locale + ':' + key] = stringSchema.transform(capitalize)
      });
    }
  }
  return translatedSchema
}

export const pageStepOneSchema = z.object({
  ...getCMSTranslatedSchema(CategoryEntityEnum.Page), // translated fields
})
.transform(formatTranslatedFormValuesToSave);

export const pageStepTwoSchema = cmsSchema.pick({
  bannerImage: true,
  previewImage: true,
  images: true
});

export const pageStepThreeSchema = z.object({
  category: z.preprocess(
    // ISSUE: https://stackoverflow.com/questions/74256866/validating-optional-fields-in-react-using-zod
    (value) => value === '' ? undefined : value,
    categoryOptionSchema.nullable().optional()
  ),
  active: z.boolean({ errorMap }).optional(),
  linkLocations: z.array(z.enum(['menu', 'footer'])).optional(),
});

export const pageBlockSchema = z.object({
  ...getTranslatedBlockSchema(),
  image: getSingleImageSchema(),
  imagePosition: z.enum(['left', 'right', 'bottom']).optional(),
}).refine(values => {
  if (!values.image) return true;
  // imagePosition is required if image is set
  return values.imagePosition;

}, {
  message: i18n.t('cms:errors.imagePositionRequired'),
  path: ['imagePosition'],
});

export const pageBlocksStepOneSchema = z.object({
  ...getTranslatedPageBlockSchema(), // translated fields
})
.transform(formatTranslatedFormValuesToSave);

export const pageBlocksStepTwoSchema = z.object({
    blocks: z.array(pageBlockSchema).optional()
  })
  .transform(formatTranslatedPageFormValuesToSave);