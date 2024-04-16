import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { pageFilterSchema, pageSchema } from "@/validations/page.validations";
import { IFileCloud } from "./file.type";
import { ICategory } from "./category.type";
import { ISEOFields } from "./app.type";

export interface IPageTranslatedFields extends ISEOFields {
  title: string;
  content: string;
}

export interface IPage extends Attributes {
  objectId: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
  user: IUser;
  updatedBy?: IUser;
  deletedBy?: IUser;
  deletedAt?: string;
  deleted: boolean;
  translated: IPageTranslatedFields;
  bannerImage?: IFileCloud;
  previewImage?: IFileCloud;
  images?: IFileCloud[];
  categories: ICategory[];
}

export interface IPageState {
  loading: boolean;
  page: IPage | null;
  pages: IPage[];
  count: number;
}

export type IPageInput = z.infer<typeof pageSchema>;
export type PageFiltersInput = z.infer<typeof pageFilterSchema>;

