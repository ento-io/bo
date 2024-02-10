import Parse, { Attributes } from 'parse';

import { actionWithLoader } from '@/utils/app.utils';
import { PAGINATION, DEFAULT_PAGINATION } from '@/utils/constants';
import { uploadFileAPI } from '@/utils/file.utils';
import { canAccessTo, getRolesForUser } from '@/utils/role.utils';
import { isUserFromBO } from '@/utils/user.utils';
import { escapeText, isBoolean } from '@/utils/utils';
import { setValues } from '@/utils/parse.utils';

import { IQueriesInput } from '@/types/app.type';
import { ISignUpInput } from '@/types/auth.types';
import { ProfileUserInfoInput, IUser } from '@/types/user.type';
import i18n from '@/config/i18n';
import { AppDispatch, AppThunkAction } from '@/redux/store';
import {
  clearUserCountSlice,
  clearUserSlice,
  clearUsersSlice,
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
} from '@/redux/reducers/app.reducer';

import { RootState } from '../store';
import { SIGNUP_PROPERTIES } from './auth.action';
import { loadRoles } from './role.action';

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
    let query = await new Parse.Query(Parse.User);

    // full text search
    // should be before all other queries
    if (search?.text) {
      const text = escapeText(search.text);

      query = Parse.Query.or(
        new Parse.Query(Parse.User).matches('lastName', text),
        new Parse.Query(Parse.User).matches('firstName', text),
        new Parse.Query(Parse.User).matches('username', text),
      );
    }

    query.limit(+limit).skip(+skip);
    // user from BO
    const fromBO = filters && isBoolean(filters?.fromBO);

    // mainly for page (url)
    if (filters) {
      if (isBoolean(filters?.deleted)) {
        query.equalTo('deleted', filters.deleted);
      }

      if (isBoolean(filters?.seen)) {
        query.equalTo('seen', filters.seen);
      }
    }

    // Advanced search
    if (search) {
      if (search.lastName) {
        query.matches('lastName', escapeText(search.lastName));
      }
      if (search.firstName) {
        query.matches('firstName', escapeText(search.firstName));
      }
      if (search.email) {
        query.matches('username', escapeText(search.email));
      }
      if (search.sex) {
        query.containedIn('sex', search.sex);
      }

      if (search.platform) {
        query.containedIn('platform', search.platform);
      }

      if (search.isOnline) {
        // if online or offline
        if (search.isOnline.length !== 2) {
          // offline
          if (search.isOnline.length === 1 && !search.isOnline[0]) {
            query.notEqualTo('isOnline', true);
            // online
          } else {
            query.equalTo('isOnline', true);
          }
        }
      }
    }

    if (fromBO) {
      query.equalTo('platform', 'bo');
    } else {
      query.notEqualTo('platform', 'bo');
    }

    if (order === 'desc') {
      query.descending(orderBy);
    } else {
      query.ascending(orderBy);
    }

    const result: Record<string, any> = await query.withCount().find();

    // get and display user roles depending on the role of the current user
    const users = [];
    if (fromBO) {
      for (const user of result.results) {
        const rolesForUser = await getRolesForUser(user, false);
        users.push({
          ...user.toJSON(),
          roles: rolesForUser.map((role: any) => role.toJSON()),
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

    dispatch(updateUsersByUserSlice(updatedUser.toJSON() as IUser));
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


// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
export const onUsersEnter = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    // console.log('dispatch: ', dispatch);
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canFind = canAccessTo(roles, '_User', 'find');

    // redirect to not found page
    if (!canFind) {
      // dispatch(goToNotFound());
      return;
    }

    const values: Record<string, any> = {
      skip: DEFAULT_PAGINATION.currentPage,
      limit: DEFAULT_PAGINATION.rowsPerPage,
      orderBy: DEFAULT_PAGINATION.orderBy,
      order: DEFAULT_PAGINATION.order,
    };

    const filters: Record<string, boolean> = {};

    // add role to filter
    // if (location?.pathname.includes('admins')) {
    //   filters.fromBO = true;
    // }

    // if (searchParams) {
    //   const seenTab = tabToFilters(searchParams.tab);
    //   filters.seen = seenTab?.seen;
    // }

    values.filters = filters;

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
    const user = await new Parse.Query(Parse.User)
      .equalTo('objectId', route.params.id)
      .exclude('sessionToken', 'ACL')
      .first();

    if (!user) return;

    // decrement contact notification count
    await Parse.Cloud.run('markUserAsSeen', { id: user.id });
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

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
// export const goToUsers = (querySearchObject?: Record<string, any>): UpdateLocationActions => {
//   return push('/' + PATH_NAMES.users + objectToRouteSearchParams(querySearchObject));
// };
// export const goToAdmins = (): UpdateLocationActions => push('/' + PATH_NAMES.admins);
// export const goToUser = (id: string): UpdateLocationActions => push('/' + PATH_NAMES.users + '/' + id);
