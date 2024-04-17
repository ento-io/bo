import { z } from "zod";
import { articleFilterSchema, cmsSchema, getCMSTranslatedSchema } from "./article.validations";
import { formatTranslatedPageFormValuesToSave } from "@/utils/cms.utils";
import { categoryOptionSchema } from "./category.validation";
import { CategoryEntityEnum } from "@/types/category.type";
import { locales } from "@/config/i18n";

export const pageFilterSchema = articleFilterSchema.extend({
  metaTitle: z.string().optional(),
});

const getTranslatedBlockSchema = () => {
  const values: Record<string, any> = {};
  for (const locale of locales) {
    values[locale + ':name'] = z.string().optional();
  }
  return values
}

export const pageSchema = cmsSchema
  .extend({
    ...getCMSTranslatedSchema(CategoryEntityEnum.Page), // translated fields
    category: z.preprocess(
      val => {
        return val === '' ? undefined : val
      },
      categoryOptionSchema.optional()),
    blocks: z.array(z.object(getTranslatedBlockSchema())).optional()
  })
  .transform(formatTranslatedPageFormValuesToSave);