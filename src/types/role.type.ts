import { Attributes } from 'parse';
import { z } from 'zod';
import { roleSchema, rolesForUserSchema } from '@/validations/role.validations';

export type IRoleInput = z.infer<typeof roleSchema>
export type RolesForUserInput = z.infer<typeof rolesForUserSchema>

export interface IRights {
  create: boolean;
  find: boolean;
  get: boolean;
  update: boolean;
  delete: boolean;
}

export interface IRightsItem {
  label?: string;
  className: string;
  rights: IRights;
}

export interface IRole extends Attributes {
  objectId: string;
  name: string;
  updatedAt?: string;
  createdAt?: string;
  rights: IRightsItem[];
}

export interface IRoleState {
  loading: boolean;
  role: IRole | null;
  roles: IRole[];
  userRoles: IRole[];
  currentUserRoles: IRole[];
  isAdmin: boolean;
}

export type ILoadRolesInput = {
  limit: number;
  skip: number;
  withAdminOrBetter: boolean;
  withUsersCount: boolean;
  incrementItems: boolean;
  selects: string[];
};

