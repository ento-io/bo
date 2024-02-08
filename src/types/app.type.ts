import { z } from "zod";
import { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { IUser } from "./user.type";
import { confirmDeletionSchema, settingsSchema } from "@/validations/app.validations";
import { Store } from "@/redux/store";
import { DateType } from "./util.type";

export type ISettingsInput = z.infer<typeof settingsSchema>;
export type ConfirmDeletionInput = z.infer<typeof confirmDeletionSchema>;

export interface ISelectOption<T = string> {
  label: string;
  value: T,
  icon?: string | ReactNode;
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

// image returned by the upload ap
export interface IDefaultPagination extends Omit<IPagination, 'currentPage'> {
  rowsPerPageOptions?: number[];
}

export type IIdParams = {
  id: string;
};

export type IRouteContext = {
  store: Store | null;
}


export interface ICardRadio<T = string> extends ISelectOption<T> {
  readonly icon?: any;
  readonly description?: string;
}

export type INavigate = ReturnType<typeof useNavigate>;

export interface INotificationMenu {
  objectId: string;
  user?: IUser;
  title: string;
  description: string;
  date: DateType;
  onClick?: () => void; // mainly id
}