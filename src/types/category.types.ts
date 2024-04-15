import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { categoryFilterSchema, categorySchema } from "@/validations/category.validation";
import { ISelectOption } from "./app.type";

export interface ITranslatedFields {
  name: string;
}

export enum CategoryEntityEnum {
  Article = "article",
  Page = "page",
}

type ICategoryTypeEntity = `${CategoryEntityEnum}`;
export type ICategoryEntityOption = ISelectOption<ICategoryTypeEntity>;
export interface ICategory extends Attributes {
  objectId: string;
  updatedAt?: string;
  createdAt?: string;
  user: IUser;
  updatedBy?: IUser;
  deletedBy?: IUser;
  deletedAt?: string;
  deleted: boolean;
  translated: ITranslatedFields;
  // each category can be linked to an article, a page, product, ...
  entity: CategoryEntityEnum;
}

export interface ICategoryState {
  loading: boolean;
  category: ICategory | null;
  categories: ICategory[];
  count: number;
}

export type ICategoryInput = z.infer<typeof categorySchema>;
export type CategoryFiltersInput = z.infer<typeof categoryFilterSchema>;

