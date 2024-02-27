import { Attributes } from "parse";
import { z } from "zod";
import { sendEmailSchema } from "@/validations/email.validation";
import { userFilterSchema, usersRouteSearchParams } from "@/validations/user.validation";
import { IQueriesInput } from "./app.type";

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
export type UserFiltersInput = z.infer<typeof userFilterSchema>;
export type IUsersRouteSearchParams = z.infer<typeof usersRouteSearchParams>;

export enum SexEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum PlatformEnum {
  WEB = 'web',
  BO = 'bo',
  ANDROID = 'android',
  IOS = 'ios',
}

export type IPlatform = PlatformEnum.WEB | PlatformEnum.BO | PlatformEnum.ANDROID | PlatformEnum.IOS;

export type Sex = SexEnum.FEMALE | SexEnum.MALE;

export interface Phone {
  code: string;
  number: string;
}

export interface IUser extends Attributes {
  objectId: string;
  email: string;
  username?: string;
  updatedAt?: string;
  createdAt?: string;
  firstName?: string;
  lastName: string;
  banned?: boolean;
}

export interface IUserState {
  loading: boolean;
  user: IUser | null;
  users: IUser[];
  count: number;
  search: Record<string, any> | null;
  filters: Record<string, string | boolean> | null;
}
export type ProfileUserInfoInput = Pick<IUser, 'lastName' | 'firstName'>;

export interface IStoredCurrentUser extends Pick<IUser, 'objectId' | 'firstName' | 'lastName' | 'image'> {
  email?: string;
}

export interface IUserQueriesInput extends IQueriesInput {
  roles?: string[];
}

export interface IUserCloudInput extends Omit<IUserQueriesInput, 'roles'> {
  ids?: string[];
  fromBO?: boolean;
}
