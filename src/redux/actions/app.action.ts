import Parse from 'parse';
import dayjs from 'dayjs';
import { actionWithLoader } from '@/utils/app.utils';
import { ISettingsInput } from '@/types/app.type';
import { Lang } from '@/types/setting.type';
import i18n from '@/config/i18n';
import { setMessageSlice, setNotificationsSlice } from '@/redux/reducers/app.reducer';
import { loadCurrentUserIsAdminSlice, loadCurrentUserRolesSlice } from '@/redux/reducers/role.reducer';
import { setLang } from '@/redux/reducers/settings.reducer';
import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { getAppNotificationsSelector } from '../reducers/app.reducer';
import { getRolesForUser, isAdmin } from '@/utils/role.utils';
import { PATH_NAMES } from '@/utils/pathnames';
import { DateType } from '@/types/util.type';
import { getNewEstimatesCount } from './estimate.action';
import { getNewUsersCount } from './user.action';

// ----------------------------------------------------- //
// ------------------- Parse queries ------------------- //
// ----------------------------------------------------- //
export const dateRangeQuery = (query: Parse.Query, field: string, range: (DateType | null)[]): void => {
  if (!Array.isArray(range)) return;
  const start = range[0];
  const end = range[1];
  // greater or equal than start date
  if (start && !end) {
    query
      .greaterThanOrEqualTo(field, dayjs(start).startOf('day').toDate())
      .lessThanOrEqualTo(field, dayjs(start).endOf('day').toDate());
  }
  // lesser or equal than end date
  if (end && !start) {
    query
      .greaterThanOrEqualTo(field, dayjs(end).startOf('day').toDate())
      .lessThanOrEqualTo(field, dayjs(end).endOf('day').toDate());
  }
  // between 2 dates
  if (start && end) {
    query
      .greaterThanOrEqualTo(field, dayjs(start).startOf('day').toDate())
      .lessThanOrEqualTo(field, dayjs(end).endOf('day').toDate());
  }
};

/**
 * query multiple date fields
 * @param query 
 * @param search 
 */
export const filtersDatesQuery = (
  query: Parse.Query,
  search: Record<string, string | (DateType | null)[]>,
  otherDateFields = []
) => {
  ['createdAt', 'updatedAt', ...otherDateFields].forEach((field) => { 
    if (search[field]) {
      dateRangeQuery(query, field, search[field] as (DateType | null)[]);
    }
  });
}

/**
 * mark an entity as seen
 * used mainly when entering a page with the entity id
 * @param parseObj
 * @param notify key in store ex: { notifications: { estimate: 2 }, notify here is "estimate" key
 * @returns
 */
export const markAsSeen = (parseObj: Parse.Object, notify: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const notification = getAppNotificationsSelector(state as any);
    const count = notification?.[notify] ?? 0;

    parseObj.set('seen', true);
    await parseObj.save();

    // update notification count
    dispatch(setNotificationsSlice({ [notify]: count - 1 })); // from sidebar
  });
};

/**
 * change browser and stored language
 * @param lang fr, ...
 * @returns
 */
export const changeLang = (lang: Lang): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    i18n.changeLanguage(lang);
    // update language in store
    dispatch(setLang(lang));
  });
};

/**
 * add new contact to the database
 * @param values form values
 * @returns
 */
export const changeSettings = (values: ISettingsInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // update i18n default language
    dispatch(setMessageSlice(i18n.t('common:infoMessages.successfullySaveSettings')));
    dispatch(changeLang(values.lang as Lang));
  });
};

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //
/**
 * load data when entering any dashboard page
 * @returns
 */
export const onDashboardEnter = (): any => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const [currentUserRoles, admin] = await Promise.all([
      getRolesForUser(null, true, true),
      isAdmin(),
      dispatch(getNewEstimatesCount()),
      dispatch(getNewUsersCount())
    ]);

    dispatch(loadCurrentUserRolesSlice(currentUserRoles));
    dispatch(loadCurrentUserIsAdminSlice(admin));
  };
};

/**
 * this function is called in route beforeLoad or loader
 * NOTE: it's a simple function, not a thunk (dispatched action)
 * it's take a params as thunk (function) and return a function
 * @param routeParams 
 * @returns 
 */
export const onEnter = (onEnterAction: (dispatch: AppDispatch, getState?: () => RootState) => AppThunkAction) => (routeParams: any) =>  {
  // get store from context (passed in RouterProvider)
  const { store } = routeParams.context;
  if (!store) return;
  const newContext = { ...routeParams };
  // remove the store passed to a thunk (action function)
  // because it's already has dispatch and getState
  delete newContext.context.store;
  // run the thunk
  onEnterAction(newContext)(store.dispatch, store.getState);
}

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToSettings = () => ({ to: PATH_NAMES.settings });
export const goToNotFound = () => ({ to: PATH_NAMES.notFound });
export const goToHome = () => ({ to: '/' });