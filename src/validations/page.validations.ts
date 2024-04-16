import { z } from "zod";
import { articleFilterSchema, cmsSchema, getCMSTranslatedSchema } from "./article.validations";
import { formatTranslatedFormValuesToSave } from "@/utils/cms.utils";
import { categoryOptionSchema } from "./category.validation";
import { CategoryEntityEnum } from "@/types/category.type";

export const pageFilterSchema = articleFilterSchema.extend({
  metaTitle: z.string().optional(),
});

export const pageSchema = cmsSchema
  .extend({
    ...getCMSTranslatedSchema(CategoryEntityEnum.Page), // translated fields
    category: categoryOptionSchema,
  })
  .transform(formatTranslatedFormValuesToSave);