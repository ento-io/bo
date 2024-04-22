import { z } from "zod";
import { capitalize } from "string-ts";
import { CategoryEntityEnum } from "../types/category.type";
import { dateForAdvancedSearchSchema } from "./app.validations";
import { formatTranslatedFormValuesToSave } from "@/utils/cms.utils";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import { errorMap } from '@/config/zod';
import i18n, { locales } from "@/config/i18n";
import { getMultipleImagesSchema, getSingleImageSchema } from "./file.validation";
import { categoryOptionSchema } from "./category.validation";

export const emptyContent = (value?: string): string => {
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

export const getCMSTranslatedSchema = (entity = CategoryEntityEnum.Article) => {
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
    ).transform(capitalize);
    translatedSchema[locale + ':metaDescription'] = z.string({ errorMap })
      .max(170, i18n.t('form.error.max', { field: i18n.t('common:metaDescription'), number: 170 }))
      .transform(capitalize);

    if (entity === CategoryEntityEnum.Page) {
      translatedSchema[locale + ':description'] = z.string({ errorMap })
        .max(300, i18n.t('form.error.max', { field: i18n.t('common:description'), number: 300 }))
        .transform(capitalize);
    }
    // ------------------------------------ //
    // - required only for default locale - //
    // ------------------------------------ //
    // other locales are optional
    if (locale !== DEFAULT_LANGUAGE) {
      if (entity === CategoryEntityEnum.Page) {
        translatedSchema[locale + ':name'] = z.string({ errorMap }).optional();
      }
      translatedSchema[locale + ':title'] = z.string({ errorMap }).transform(capitalize);
      translatedSchema[locale + ':content'] = z.string({ errorMap }).optional().transform(emptyContent);
    } else {
      // required fields only for default locale
      [{
        key: 'name',
        label: i18n.t('cms:pageName'),
        validate: entity === CategoryEntityEnum.Page
      }, {
        key: 'title',
        label: i18n.t('common:title'),
        validate: true,
      }, {
        key: 'content',
        label: i18n.t('common:content'),
        validate: true,
      }].forEach(({ key, label, validate }) => {
        if (validate) {
          translatedSchema[locale + ':' + key] = z.string({ errorMap })
          .min(1, i18n.t('form.error.required', { field: label }))
          .transform(emptyContent);
        }
      });
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
    ...getCMSTranslatedSchema(), // translated fields
    categories: z.array(categoryOptionSchema).optional(),
  })
  .transform(formatTranslatedFormValuesToSave);