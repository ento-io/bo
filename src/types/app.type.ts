import { z } from "zod";
import { IUser } from "./user.type";
import { settingsSchema } from "@/validations/app.validations";

export type ISettingsInput = z.infer<typeof settingsSchema>;

export interface ISelectOption<T = string> {
  label: string;
  value: T
}

type AppSnackBar = {
  open: boolean;
  type: string;
  message: string;
  duration: number;
};

export type ISeverity = 'success' | 'info' | 'warning' | 'error' | '';
export interface IAlert {
  severity: ISeverity;
  type?: 'accountVerification' | 'resetPassword'; // add another type later
  message?: string;
  title?: string;
  duration?: 'permanent' | 'temporary';
}
export interface IAppState {
  loading: boolean;
  error: string;
  message: string;
  infoMessage: string;
  appSnackBar: AppSnackBar;
  currentUser?: IUser | null;
  accountEmail?: string;
  pageTitle: string;
  notifications: Record<string, number>;
  alert: IAlert | null;
}

export enum EnvironmentEnum {
  DEV = 'DEV',
  PROD = 'PROD',
}

export type OrderType = 'desc' | 'asc';
export interface IOrderList {
  orderBy: string;
  order: OrderType;
}

export type IFilterInput = {
  filters: Record<string, any>;
  search: Record<string, any>;
};

export interface IQueriesInput extends Partial<IFilterInput> {
  limit?: number;
  skip?: number;
  orderBy?: string;
  order?: string;
  select?: string[];
  include?: string[];
}

export interface IPagination extends IOrderList {
  selected?: any[];
  currentPage: number;
  rowsPerPage: number;
}

// image returned by the upload api
export interface IFileCloud {
  url: string;
  publicId: string;
}
export interface IDefaultPagination extends Omit<IPagination, 'currentPage'> {
  rowsPerPageOptions?: number[];
}