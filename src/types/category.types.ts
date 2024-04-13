import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { categoryFilterSchema, categorySchema } from "@/validations/category.validation";

export interface ITranslatedFields {
  name: string;
}

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
}

export interface ICategoryState {
  loading: boolean;
  category: ICategory | null;
  categories: ICategory[];
  count: number;
}

export type ICategoryInput = z.infer<typeof categorySchema>;
export type CategoryFiltersInput = z.infer<typeof categoryFilterSchema>;

