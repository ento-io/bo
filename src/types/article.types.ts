import { z } from "zod";
import { articleSchema } from "../validations/article.validations";

export interface IArticle extends Parse.Object {
  id: string;
  title: string;
  content: string;
  // author: IUser;
}

export type IArticleInput = z.infer<typeof articleSchema>;

export interface IArticleResponse {
  success: boolean;
  article: IArticle;
}

export interface IArticleResponse {
  success: boolean;
  article: IArticle;
}

export interface IArticleData {
  success: boolean;
  loading: boolean;
  articles?: IArticle[];
  error?: string;
}