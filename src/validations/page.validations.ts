import { z } from "zod";
import { articleFilterSchema, cmsSchema, getCMSTranslatedSchema } from "./article.validations";
import { formatTranslatedFormValuesToSave } from "@/utils/cms.utils";
import { categoryOptionSchema } from "./category.validation";

export const pageFilterSchema = articleFilterSchema.extend({
  metaTitle: z.string().optional(),
});

export const pageSchema = cmsSchema
  .extend({
    ...getCMSTranslatedSchema(), // translated fields
    category: categoryOptionSchema,
  })
  .transform(formatTranslatedFormValuesToSave);