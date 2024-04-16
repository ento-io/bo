import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { articleFilterSchema, articleSchema } from "@/validations/article.validations";
import { IFileCloud } from "./file.type";
import { ICategory } from "./category.type";
import { ISEOFields } from "./app.type";

export interface IArticleTranslatedFields extends ISEOFields {
  title: string;
  content: string;
}

export interface IArticle extends Attributes {
  objectId: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
  user: IUser;
  updatedBy?: IUser;
  deletedBy?: IUser;
  deletedAt?: string;
  deleted: boolean;
  translated: IArticleTranslatedFields;
  bannerImage?: IFileCloud;
  previewImage?: IFileCloud;
  images?: IFileCloud[];
  categories: ICategory[];
}

export interface IArticleState {
  loading: boolean;
  article: IArticle | null;
  articles: IArticle[];
  count: number;
}

export type IArticleInput = z.infer<typeof articleSchema>;
export type ArticleFiltersInput = z.infer<typeof articleFilterSchema>;

