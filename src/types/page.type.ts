import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { pageFilterSchema, pageSchema } from "@/validations/page.validations";
import { IFileCloud } from "./file.type";
import { ICategory } from "./category.type";
import { ISEOFields } from "./app.type";

export interface IPageTranslatedFields extends ISEOFields {
  title: string;
  name: string;
  content: string;
  description?: string;
}

export interface IPageBlock {
  translated: {
    [key: string]: Omit<IPageTranslatedFields, 'name'>
  };
}

export interface IPage extends Attributes {
  objectId: string;
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
  category?: ICategory;
  blocks?: IPageBlock[];
}

export interface IPageState {
  loading: boolean;
  page: IPage | null;
  pages: IPage[];
  count: number;
}

export type IPageInput = z.infer<typeof pageSchema>;
export type PageFiltersInput = z.infer<typeof pageFilterSchema>;

