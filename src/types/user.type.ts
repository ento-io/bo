import { Attributes } from "parse";

export enum SexEnum {
  MALE = 'male',
  FEMALE = 'female',
}

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
}
export type ProfileUserInfoInput = Pick<IUser, 'lastName' | 'firstName'>;

export interface IStoredCurrentUser extends Pick<IUser, 'objectId' | 'firstName' | 'lastName' | 'image'> {
  email?: string;
}