import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { articleFilterSchema, articleSchema } from "@/validations/article.validations";

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
}

export interface IArticleState {
  loading: boolean;
  article: IArticle | null;
  articles: IArticle[];
  count: number;
}

export type IArticleInput = z.infer<typeof articleSchema>;
export type ArticleFiltersInput = z.infer<typeof articleFilterSchema>;

