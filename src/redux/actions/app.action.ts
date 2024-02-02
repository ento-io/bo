import { actionWithLoader } from '@/utils/app.utils';
import { ISettingsInput } from '@/types/app.type';
import { Lang } from '@/types/setting.type';
import i18n from '@/config/i18n';
import { setMessageSlice, setNotificationsSlice } from '@/redux/reducers/app.reducer';
import { loadCurrentUserRolesSlice } from '@/redux/reducers/role.reducer';
import { setLang } from '@/redux/reducers/settings.reducer';
import { AppDispatch, RootState } from '@/redux/store';

import { getAppNotificationsSelector } from '../reducers/app.reducer';
import { getRolesForUser } from '@/utils/role.utils';


// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //
/**
 * load data when entering any dashboard page
 * @returns
 */
export const onDashboardEnter = (): any => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const [currentUserRoles] = await Promise.all([getRolesForUser()]);

    dispatch(loadCurrentUserRolesSlice(currentUserRoles));
  };
};


// export const onAdministrationEnter = ({ params }: IOnRouteEnterInput): any => {
//   return async (dispatch: AppDispatch): Promise<void> => {
//     if (!params) return;
//     // const filters = { filters: { deleted: true } };
//     // ----------------------------- //
//     // -------- contact tab -------- //
//     // ----------------------------- //
//     if (params.tab.includes(ADMINISTRATION_TAB_PATHNAMES.employees)) {
//       // dispatch(loadRoles({ withAdminOrBetter: true, withUsersCount: false, selects: ['objectId', 'name'] }));
//     }
//   };
// };


/**
 * mark an entity as seen
 * used mainly when entering a page with the entity id
 * @param parseObj
 * @param notify
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

// -------------------------------------- //
// ------------ redirections ------------ //
// -------------------------------------- //
// export const goToHome = (): UpdateLocationActions => push('/');
// export const goToRecycleBin = (tab: string): UpdateLocationActions => push('/' + PATH_NAMES.recycleBin + '/' + tab);
// export const goToSettings = (): UpdateLocationActions => push('/' + PATH_NAMES.settings);
// export const goToStatistics = (tab: string): UpdateLocationActions => push('/' + PATH_NAMES.statistics + '/' + tab);
// export const goToAdministration = (tab: string): UpdateLocationActions =>
//   push('/' + PATH_NAMES.administration + '/' + tab);

// // this route does not exist, we just need to trigger the 404 page
// export const goToNotFound = (): UpdateLocationActions => push('/not-found');
