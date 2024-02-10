import Parse from 'parse';
import i18n from '@/config/i18n';

import { setMessageSlice } from '@/redux/reducers/app.reducer';
import {
  addRoleSlice,
  destroyRoleSlice,
  getRoleRolesSelector,
  loadRolesSlice,
  loadUserRolesSlice,
  updateRolesByRoleSlice,
} from '@/redux/reducers/role.reducer';
import { AppDispatch, RootState } from '@/redux/store';

// import { PATH_NAMES } from '@/routes/pathnames';

import { actionWithLoader } from '@/utils/app.utils';
import { HIGHEST_LEVEL_DEFAULT_ROLES, ROLE_DEFAULT_LIMIT } from '@/utils/constants';

import { ILoadRolesInput, IRole, IRoleInput, RolesForUserInput } from '@/types/role.type';

export const loadRoles = ({
  limit = ROLE_DEFAULT_LIMIT,
  skip = 0,
  withAdminOrBetter = true,
  withUsersCount = false,
  incrementItems = false,
}: Partial<ILoadRolesInput>): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const oldRoles = getRoleRolesSelector(state as Record<string, any>);
    // --------- load from database --------- //
    const query = await new Parse.Query(Parse.Role).notEqualTo('deleted', true);

    if (withAdminOrBetter) {
      query.notEqualTo('name', HIGHEST_LEVEL_DEFAULT_ROLES[0]);
    } else {
      query.notContainedIn('name', HIGHEST_LEVEL_DEFAULT_ROLES);
    }

    query.limit(+limit).skip(+skip);

    const roles: Record<string, any>[] = await query.find();

    const rolesJson = [];

    if (withUsersCount) {
      for (const role of roles) {
        const count = await role.getUsers().query().count();
        const roleJson = role.toJSON();
        rolesJson.push({
          ...roleJson,
          count,
        });
      }
    } else {
      for (const role of roles) {
        rolesJson.push(role.toJSON());
      }
    }

    const newRoles = incrementItems ? [...oldRoles, ...rolesJson] : rolesJson;
    // --------- update store --------- //
    dispatch(loadRolesSlice(newRoles));
  });
};

/**
 * create Role with hierarchy
 * @param values
 * @returns
 */
export const createRole = (values: IRoleInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // --------- update database --------- //
    const body = {
      parentRoleNames: values.children,
      roleName: values.name,
      rights: values.rights.map((right: any) => ({ className: right.className, rights: right.rights })),
    };

    const newRole = await Parse.Cloud.run('createRole', body);

    if (!newRole) {
      throw new Error(i18n.t('user:role.roleNotCreated'));
    }

    // --------- update store --------- //
    dispatch(addRoleSlice(newRole.toJSON()));
  });
};

export const updateRole = (name: string, values: IRoleInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // --------- update database --------- //
    const body = {
      name,
      parentRoleNames: values.children,
      rights: values.rights.map((right: any) => ({ className: right.className, rights: right.rights })),
    };

    const newRole = await Parse.Cloud.run('updateRole', body);

    if (!newRole) {
      throw new Error(i18n.t('user:role.roleNotCreated'));
    }

    // --------- update store --------- //
    dispatch(updateRolesByRoleSlice(newRole.toJSON()));
  });
};

export const addRolesToUser = (userId: string, values: RolesForUserInput, currentRoles: IRole[]): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // --------- update database --------- //
    const currentRoleNames = currentRoles.map((role: IRole): string => role.name);
    const allRoleNames = [...values.roles, ...currentRoleNames];

    const body = { userId, roleNames: allRoleNames };
    await Parse.Cloud.run('addOrUpdateRolesToUser', body);

    // reload user roles
    const roles = await new Parse.Query(Parse.Role)
      .notEqualTo('deleted', true)
      .containedIn('name', allRoleNames)
      .limit(1000)
      .skip(0)
      .find();

    // --------- update store --------- //
    const rolesJson = roles.map(role => role.toJSON());

    dispatch(loadUserRolesSlice(rolesJson as any));

    dispatch(setMessageSlice(i18n.t('user:role.addRolesToThisUserSuccessfully', { count: rolesJson.length })));
  });
};

export const removeRolesForUser = (userId: string, roles: IRole[]): any => {
  return async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const userRoles = (state as any)?.role.userRoles ?? [];

    // --------- update database --------- //
    const roleNames = roles.map((role: IRole): string => role.name);
    const body = { userId, roleNames };
    await Parse.Cloud.run('removeRolesForUser', body);

    // get the non removed roles
    const newRoles = userRoles.filter((role: IRole) => !roleNames.includes(role.name));

    // --------- update store --------- //
    dispatch(loadUserRolesSlice(newRoles as any));

    dispatch(
      setMessageSlice(
        i18n.t('user:role.removeRolesForThisUserSuccessfully', { count: roleNames.length - newRoles.length }),
      ),
    );
  };
};

/**
 * destroy role and unlink its users
 * @param id
 * @returns
 */
export const destroyRole = (id: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // update the database
    const role = await new Parse.Query(Parse.Role).equalTo('objectId', id).first();
    // display success message
    await role?.destroy();

    dispatch(setMessageSlice(i18n.t('user:role.deleteRoleSuccessfully', { name: role?.getName() })));

    // reload the list of deleted rides
    await dispatch(destroyRoleSlice(id));
  });
};

// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
export const onRolesEnter = (): any => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(loadRoles({ withAdminOrBetter: false, withUsersCount: true }));
  };
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
// export const goToRoles = (): UpdateLocationAction<'push'> => push(PATH_NAMES.roles);
