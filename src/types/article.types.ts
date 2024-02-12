import { Attributes } from "parse";
import { IUser } from "./user.type";

export interface IArticle extends Attributes {
  objectId: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
  author: IUser;
}

export interface IArticleState {
  loading: boolean;
  article: IArticle | null;
  articles: IArticle[];
  count: number;
}
