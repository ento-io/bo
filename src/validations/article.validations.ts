import { z } from "zod";
import { capitalize } from "string-ts";
import { dateForAdvancedSearchSchema } from "./app.validations";
import { formatTranslatedFormValuesToSave } from "@/utils/cms.utils";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import { errorMap } from '@/config/zod';
import i18n, { locales } from "@/config/i18n";
import { getMultipleImagesSchema, getSingleImageSchema } from "./file.validation";
import { categoryOptionSchema } from "./category.validation";

const emptyContent = (value?: string): string => {
  if (!value || value === '<p><br></p>') {
    return '';
  }

  return value;
};

export const articleFilterSchema = z.object({
  title: z.string().optional(),
  createdAt: dateForAdvancedSearchSchema,
  updatedAt: dateForAdvancedSearchSchema,
  user: z.string().optional(),
  category: categoryOptionSchema.optional(),
  active: z.array(z.boolean().optional()).optional(),
});

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
    // metaTitle
    translatedSchema[locale + ':metaTitle'] = z.string({ errorMap }).max(
      70,
      i18n.t('form.error.max', { field: i18n.t('common:metaTitle'), number: 70 }),
    );
    translatedSchema[locale + ':metaDescription'] = z.string({ errorMap })
      .max(170, i18n.t('form.error.max', { field: i18n.t('common:metaDescription'), number: 170 }))
      .transform((value: string): string => (value ? capitalize(value) : ''));
    // ------------------------------------ //
    // - required only for default locale - //
    // ------------------------------------ //
    if (locale !== DEFAULT_LANGUAGE) {
      translatedSchema[locale + ':title'] = z.string({ errorMap }).transform((value: string): string =>
        value ? capitalize(value) : '',
      );
      translatedSchema[locale + ':content'] = z.string({ errorMap }).optional().transform(emptyContent);
    } else {
      translatedSchema[DEFAULT_LANGUAGE + ':title'] = z.string({ errorMap })
        .min(1, i18n.t('form.error.required', { field: i18n.t('common:title') }))
        .transform(capitalize);
      translatedSchema[DEFAULT_LANGUAGE + ':content'] = z.string({ errorMap })
        .min(1, i18n.t('form.error.required', { field: i18n.t('common:content') }))
        .transform(emptyContent);
    }
  });

  return translatedSchema;
};

export const cmsSchema = z.object({
  active: z.boolean({ errorMap }).optional(),
  bannerImage: getSingleImageSchema(),
  previewImage: getSingleImageSchema(),
  images: getMultipleImagesSchema()
});

export const articleSchema = cmsSchema
  .extend({
    ...getTranslatedSchema(), // translated fields
    categories: z.array(categoryOptionSchema).optional(),
  })
  .transform(formatTranslatedFormValuesToSave);