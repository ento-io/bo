import Parse, { Attributes } from 'parse';

import { actionWithLoader, convertTabToFilters } from '@/utils/app.utils';
import { DEFAULT_PAGINATION, PAGINATION } from '@/utils/constants';
import { uploadFileAPI } from '@/utils/file.utils';
import { canAccessTo, getRolesForUser } from '@/utils/role.utils';
import { getUserFullName, isUserFromBO, usersTabOptions } from '@/utils/user.utils';
import { escapeText } from '@/utils/utils';
import { setValues } from '@/utils/parse.utils';

import { ISignUpInput } from '@/types/auth.types';
import { ProfileUserInfoInput, IUser, SendEmailInput, IUserCloudInput } from '@/types/user.type';
import i18n from '@/config/i18n';
import { AppDispatch, AppThunkAction } from '@/redux/store';
import {
  clearUserCountSlice,
  clearUserSlice,
  clearUsersSlice,
  deleteUsersSlice,
  loadUserSlice,
  loadUsersSlice,
  setUserLoadingSlice,
  setUsersCountSlice,
  updateUsersByUserSlice,
  updateUsersByUsersSlice,
} from '@/redux/reducers/user.reducer';
import {
  clearCurrentUserRolesSlice,
  getRoleCurrentUserRolesSelector,
  loadUserRolesSlice,
  clearRolesSlice,
} from '@/redux/reducers/role.reducer';
import {
  loadCurrentUserSlice,
  loadCurrentUserImageSlice,
  setMessageSlice,
  getAppNotificationsSelector,
  setNotificationsSlice,
  setErrorSlice,
} from '@/redux/reducers/app.reducer';

import { RootState } from '../store';
import { SIGNUP_PROPERTIES } from './auth.action';
import { loadRoles } from './role.action';
import { PATH_NAMES } from '@/utils/pathnames';
import { IQueriesInput } from '@/types/app.type';

// ----------------------------------------------------- //
// ------------------- Parse queries ------------------- //
// ----------------------------------------------------- //
/**
 * query a user relation from another query
 * pointer = relation
 * ex: search a user who create a contact by its name or email
 * @param mainQuery
 * @param text
 * @param field pointer name
 */
export const searchUserPointerQuery = async (mainQuery: Parse.Query, text: string, field = 'user'): Promise<void> => {
  const formattedText = escapeText(text);
  let userPointerQuery = await new Parse.Query(Parse.User);

  userPointerQuery = Parse.Query.or(
    new Parse.Query(Parse.User).matches('lastName', formattedText),
    new Parse.Query(Parse.User).matches('firstName', formattedText),
    new Parse.Query(Parse.User).matches('username', formattedText),
  );

  mainQuery.matchesQuery(field, userPointerQuery);
};

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //
/**
 * get current connected user from database
 * @returns
 */
export const getCurrentUser = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const currentUser = await Parse.User.currentAsync(); // it can throw (rarely)

    if (!currentUser) {
      dispatch(clearUserSlice());
      return;
    }

    dispatch(loadCurrentUserSlice(currentUser.toJSON() as IUser));
  });
};

export const loadUsers = ({
  limit = PAGINATION.rowsPerPage,
  skip = 0,
  orderBy = 'updatedAt',
  order = 'desc',
  filters,
  search,
}: IQueriesInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const params: IUserCloudInput = {
      limit,
      skip,
      orderBy,
      order,
      filters,
      search,
    };

    if (filters?.roles && filters.roles.length > 0) {
      params.ids = await Parse.Cloud.run('getUserIdsFromRoles', { roleNames: filters.roles });
    }

    // result with count
    const result: Record<string, any> = await Parse.Cloud.run('getUsers', params);

    // get and display user roles depending on the role of the current user
    const users = [];
    if (filters?.fromBO) {
      for (const user of result.results) {
        const rolesForUser = await getRolesForUser(user, false);
        // add roles to user if admin (created from bo)
        users.push({
          ...user.toJSON(),
          roles: rolesForUser.map((role: Parse.Role) => role.toJSON()),
        });
      }
    } else {
      for (const user of result.results) {
        users.push(user.toJSON());
      }
    }

    dispatch(loadUsersSlice(users));
    dispatch(setUsersCountSlice(result.count));
  });
};


export const uploadCurrentUserProfileImage = (file: File): any => {
  return actionWithLoader(async (dispatch: AppDispatch) => {
    const currentUser = await Parse.User.currentAsync();
    const sessionToken = currentUser?.getSessionToken() ?? '';
    const userId = currentUser?.id ?? '';

    const response = await uploadFileAPI({
      file,
      folder: 'user',
      userId,
      sessionToken,
    });

    currentUser?.set('image', response);
    await currentUser?.save();

    dispatch(loadCurrentUserImageSlice(response));
  });
};

/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deleteUserById = (id: string, redirectToRecycleBin = false): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void | undefined> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canDelete = canAccessTo(roles, '_User', 'delete');

    if (!canDelete) {
      throw new Error(i18n.t('user:errors:canNotDeleteUser'));
    }

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const updatedUser = await Parse.Cloud.run('deleteUser', { id });

    if (redirectToRecycleBin) {
      // dispatch(goToRecycleBin(RECYCLE_BIN_TAB_PATHNAMES.users));
      return;
    }

    dispatch(deleteUsersSlice(updatedUser.id));
  });
};

export const deleteUsersById = (ids: string[]): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canDelete = canAccessTo(roles, '_User', 'delete');

    if (!canDelete) {
      throw new Error(i18n.t('user:errors:canNotDeleteUser'));
    }

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const updatedUsers = await Parse.Cloud.run('deleteUsers', { ids });

    const usersJson = updatedUsers.map((user: Attributes): IUser => user.toJSON());
    dispatch(updateUsersByUsersSlice(usersJson));
  });
};

/**
 * this will delete the data from database
 * be careful when using it,
 * only the highest level (ex: Admin) can do this
 * @param ids
 * @returns
 */
export const destroyUsers = (ids: string[]): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canDelete = canAccessTo(roles, '_User', 'delete');

    if (!canDelete) {
      throw new Error(i18n.t('user:errors:canNotDeleteUser'));
    }

    const error = await Parse.Cloud.run('destroyUsers', { ids });

    if (error && error.code === 206) {
      throw new Error(i18n.t('user:errors.insufficientAuth'));
    }

    // display success message
    dispatch(
      setMessageSlice(
        i18n.t('common:infoMessages.successfullyDeletedFromDatabase', {
          count: ids.length,
          value: i18n.t('user:users'),
        }),
      ),
    );

    // reload the list of deleted requests
    const params = { filters: { deleted: true } };
    dispatch(loadUsers(params as any));
  });
};

export const toggleBanUserById = (id: string, value: boolean): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canUpdate = canAccessTo(roles, '_User', 'update');

    if (!canUpdate) {
      throw new Error(i18n.t('user:errors:canNotUpdateUser'));
    }

    // only the user or the MasterKey can update other user
    const updatedUser = await Parse.Cloud.run('toggleBanUser', { id, value });

    dispatch(updateUsersByUserSlice(updatedUser.toJSON() as IUser));
  });
};

/**
 * mark user notification as seen or not seen
 * @param id
 * @returns
 */
export const toggleUserNotification = (id: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const notification = getAppNotificationsSelector(state as any);
    let count = notification?.user ?? 0;
    const storedUser = (state as any)?.user.user;

    const user = await new Parse.Query(Parse.User).equalTo('objectId', id).first();

    if (!user) {
      throw new Error(i18n.t('user:errors:notFound'));
    }

    user.set('seen', !user.get('seen'));
    await user.save();

    // increment or decrement notification count
    if (user.get('seen')) {
      count += 1;
    } else {
      count -= 1;
    }

    // update notification count
    dispatch(setNotificationsSlice({ user: count })); // in sidebar

    // update user data
    const newStoredUser = { ...storedUser, seen: !!user.get('seen') };
    dispatch(loadUserSlice(newStoredUser as any));
  });
};

export const updateProfileUserInfo = (values: ProfileUserInfoInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) return;
    setValues(currentUser, values, ['lastName', 'firstName']);

    await currentUser.save();

    dispatch(loadCurrentUserSlice(currentUser.toJSON() as IUser));
  });
};

export const toggleBanUser = (id: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canUpdate = canAccessTo(roles, '_User', 'update');

    if (!canUpdate) {
      throw new Error(i18n.t('user:errors:canNotUpdateUser'));
    }
    // query user from database
    const user = await new Parse.Query(Parse.User).equalTo('objectId', id).first();

    if (!user) return;

    user.set('banned', !user.get('banned'));
    // save user to store (in json)
    const userJSON = user.toJSON() as IUser;

    dispatch(loadUserSlice(userJSON));
  });
};

export const inviteUser: any = (values: ISignUpInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const newValues = { ...values, username: values.email };

    // ---------- user creation ---------- //
    let user = await Parse.Cloud.run('getUserByEmail', { email: values.email });

    if (!user) {
      const newUser = new Parse.User();
      setValues(newUser, newValues, SIGNUP_PROPERTIES);
      user = await newUser.save();
    }


    dispatch(setMessageSlice(i18n.t('user:messages.employeeAddedSuccessfully')));
  }, setUserLoadingSlice);
};

export const sendEmailToUser = (user: IUser, values: SendEmailInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const isSend = await Parse.Cloud.run('sendEmailToUser', values)

    if (!isSend) {
      dispatch(setErrorSlice(i18n.t('user:emailNotSendTo', { email: values.email })))
      return 
    }
    // TODO: send email to user here
    const message = i18n.t('user:emailSentTo', { name: getUserFullName(user) });
    dispatch(setMessageSlice(message));
  });
};

// ---------------------------------------- //
// ------------- on page leave ------------ //
// ---------------------------------------- //
export const onUsersLeave = (): any => {
  return (dispatch: AppDispatch): void => {
    dispatch(clearUsersSlice());
    dispatch(clearUserCountSlice());
  };
};

export const onUserLeave = (): any => {
  return (dispatch: AppDispatch): void => {
    dispatch(clearCurrentUserRolesSlice());
    dispatch(clearRolesSlice());
  };
};


// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
export const onUsersEnter = (route: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canFind = canAccessTo(roles, '_User', 'find');

    // redirect to not found page
    if (!canFind) {
      // dispatch(goToNotFound());
      dispatch(setErrorSlice(i18n.t('common:errors.accessDenied')))
      return;
    }

    const values: Record<string, any> = {
      skip: DEFAULT_PAGINATION.currentPage,
      limit: DEFAULT_PAGINATION.rowsPerPage,
      orderBy: DEFAULT_PAGINATION.orderBy,
      order: DEFAULT_PAGINATION.order,
    };

    const filters: Record<string, boolean | string> = {
      deleted: false
    };

    // TODO: should have admin-only list page
    // if (params.location.search?.from === PlatformEnum.BO) {
      // filters.fromBO = true;
    //   filters.roles = [capitalizeFirstLetter(params.location.search.role)];
    // }

    // in "All" tab, we fetch all users other than users from BO (admins)
    if (route.search.tab === undefined) {
      values.filters = {
        ...filters,
        fromBO: false,
      }
    } else {
      const newFilters = convertTabToFilters(usersTabOptions, route.search.tab, filters);
      values.filters = newFilters;
    }

    dispatch(loadUsers(values));
  });
};

export const onUserEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const notification = getAppNotificationsSelector(state as any);
    const count = notification?.user ?? 0;
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canPreview = canAccessTo(roles, '_User', 'get');

    // redirect to not found page
    if (!canPreview) {
      // dispatch(goToNotFound());
      return;
    }

    if (!route.params?.id) return ;

    const user = await Parse.Cloud.run('getUser', { id: route.params?.id, shouldMarkAsSeen: true });

    if (!user) return;

    dispatch(setNotificationsSlice({ user: count - 1 })); // from sidebar

    // save user to store (in json)
    const userJSON = user.toJSON() as IUser;

    // load role for this user if it's created from BO
    if (isUserFromBO(userJSON)) {
      const rolesForThisUser = await getRolesForUser(user);
      dispatch(loadUserRolesSlice(rolesForThisUser));
      dispatch(loadRoles({ limit: 1000 }));
    }

    dispatch(loadUserSlice(userJSON));
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToUsers = () => ({ to: PATH_NAMES.users });
export const goToUser = (id: string) => ({ to: PATH_NAMES.users + '/$id', params: { id }});
