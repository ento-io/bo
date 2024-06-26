import { Attributes } from "parse";
import { z } from "zod";
import { IUser } from "./user.type";
import { pageBlocksStepOneSchema, pageBlocksStepTwoSchema, pageFilterSchema, pageStepOneSchema, pageStepThreeSchema } from "@/validations/page.validations";
import { IFileCloud } from "./file.type";
import { ICategory } from "./category.type";
import { ISEOFields } from "./app.type";

export interface IPageTranslatedFields extends ISEOFields {
  title: string;
  name: string;
  content: string;
  description?: string;
}

export interface ITranslatedPageBlock {
  [key: string]: Omit<IPageTranslatedFields, 'name'>
}

export interface IPageBlock extends Attributes {
  objectId: string;
  updatedAt?: string;
  createdAt?: string;
  deleted: boolean;
  translated: ITranslatedPageBlock;
  image: IFileCloud;
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
  linkLocations?: ('menu' | 'footer')[];
  active: boolean;
}

export interface IPageState {
  loading: boolean;
  page: IPage | null;
  pages: IPage[];
  count: number;
}

export type IPageStepOneInput = z.infer<typeof pageStepOneSchema>;
export type IPageStepTwoInput = z.infer<typeof pageStepOneSchema>;
export type IPageStepThreeInput = z.infer<typeof pageStepThreeSchema>;
export type IPageInput = IPageStepOneInput & IPageStepTwoInput & IPageStepThreeInput;

export type IPageBlocksStepTwoInput = z.infer<typeof pageBlocksStepTwoSchema>;
export type IPageBlocksStepOneInput = z.infer<typeof pageBlocksStepOneSchema>;

export type IPageBlocksInput = IPageBlocksStepOneInput & IPageBlocksStepTwoInput;

export type PageFiltersInput = z.infer<typeof pageFilterSchema>;

