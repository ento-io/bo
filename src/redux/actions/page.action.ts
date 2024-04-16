import Parse, { Attributes } from 'parse';

import { actionWithLoader, convertTabToFilters } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { clearPageSlice, deletePageFromPagesSlice, deletePagesSlice, loadPageSlice, loadPagesSlice, setPagesCountSlice } from '../reducers/page.reducer';
import { setMessageSlice } from '../reducers/app.reducer';
import i18n, { locales } from '@/config/i18n';
import { IPage, IPageInput } from '@/types/page.type';
import { DEFAULT_PAGINATION, PAGINATION } from '@/utils/constants';
import { IQueriesInput, ITabAndCategorySearchParams } from '@/types/app.type';
import { goToNotFound } from './app.action';
import { getRoleCurrentUserRolesSelector } from '../reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import { ALL_PAGE_FIELDS, pagesTabOptions, getCategoryPointersFromIds } from '@/utils/cms.utils';
import { setValues } from '@/utils/parse.utils';
import { uploadFormFiles, uploadUpdatedFormFiles } from '@/utils/file.utils';

const Page = Parse.Object.extend("Page");

const ARTICLE_PROPERTIES = new Set(['translated', 'categories', ...ALL_PAGE_FIELDS]);

export const getPage = async (id: string, include: string[] = []): Promise<Parse.Object | undefined> => {
  const page = await Parse.Cloud.run('getPage', { id, include });


  if (!page) {
    throw new Error(i18n.t('cms:errors.pageNotFound'));
  }
  return page;
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //

export const loadPages = ({
  limit = PAGINATION.rowsPerPage,
  skip = 0,
  orderBy = 'updatedAt',
  order = 'desc',
  filters,
  search,
}: IQueriesInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // result with count
    // we make it server side because we need to get user infos
    const result: Record<string, any> = await Parse.Cloud.run('getPages', {
      limit,
      skip,
      orderBy,
      order,
      filters,
      search,
      locales,
      include: ['categories'],
    });

    // save pages to store (in json)
    const pagesJson = result.results.map((page: any) => page.toJSON());

    dispatch(loadPagesSlice(pagesJson));
    dispatch(setPagesCountSlice(result.count));
  });
};

export const createPage = (values: IPageInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Page', 'create');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToCreate', { value: i18n.t('cms:thisPage') }));
    }

    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) {
      throw Error(i18n.t('user:errors.userNotExist'));
    }

    const page = new Page()

    const uploadedValues = await uploadFormFiles<IPage>({
      folder: 'pages',
      sessionToken: currentUser.getSessionToken(),
      values
    });

    if (values.categories) {
      values.categories = getCategoryPointersFromIds(values.categories);
    }

    const newValues = { ...values, ...uploadedValues };
    
    setValues(page, newValues, ARTICLE_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedPage = await page.save();
    dispatch(loadPageSlice((savedPage as Attributes).toJSON()));
  });
};

export const editPage = (id: string, values: IPageInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Page', 'update');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToUpdate', { value: i18n.t('cms:thisPage') }));
    }

    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) {
      throw Error(i18n.t('user:errors.userNotExist'));
    }

    const page = await getPage(id);

    if (!page) return;
    
    const uploadedValues = await uploadUpdatedFormFiles<IPage>({
      page,
      folder: 'pages',
      sessionToken: currentUser.getSessionToken(),
      values
    });

    if (values.categories) {
      values.categories = getCategoryPointersFromIds(values.categories);
    }

    const newValues = { ...values, ...uploadedValues };

    setValues(page, newValues, ARTICLE_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedPage = await page.save();
    dispatch(loadPageSlice((savedPage as Attributes).toJSON()));
  });
};

/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deletePage = (id: string,): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Page', 'delete');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToDelete', { value: i18n.t('cms:thisPage') }));
    }

    // --------- request --------- //
    const page = await getPage(id);
    if (!page) return;

    // --------- update database --------- //
    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    page.set('deleted', true);
    const deletedPage = await page.save();

    // --------- update store --------- //
    dispatch(deletePageFromPagesSlice(deletedPage.id));
    dispatch(setMessageSlice(i18n.t('cms:messages.pageDeletedSuccessfully', { value: deletedPage.id })));
  });
};

/**
 * mark seen field as true
 * so that its not more treated as notification
 * ex: (['xxx', 'xxxy'], seen, false)
 * @param ids
 * @returns
 */
export const togglePagesByIds = (ids: string[], field: string, value = true): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const isDelete = field === 'deleted';
    const hasRight = canAccessTo(roles, 'Page', isDelete ? 'delete' : 'update');

    if (!hasRight) {
      if (isDelete) {
        throw Error(i18n.t('common:errors.hasNoRightToDelete', { value: i18n.t('cms:thesePages') }));
      } else {
        throw Error(i18n.t('common:errors.hasNoRightToUpdate', { value: i18n.t('cms:thesePages') }));
      }
    }

    // update the database
    await new Parse.Query(Page).containedIn('objectId', ids).each(async page => {
      page.set(field, value);

      await page.save();
    });
    // delete
    dispatch(deletePagesSlice(ids));
  });
};

// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
/**
 * load pages data from database before the page is loaded (in route)
 * then load it to the store
 * @param route 
 * @returns 
 */
export const onPagesEnter = (route: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Page', 'find');

    // redirect to not found page
    if (!hasRight) {
      route.navigate(goToNotFound());
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

    if (route.search.category) {
      filters.category = route.search.category;
    }

    // convert the url search params tab to (db) filters
    const newFilters = convertTabToFilters(pagesTabOptions, route.search.tab, filters);
    values.filters = newFilters;

    // clear the prev state first
    dispatch(clearPageSlice());
    dispatch(loadPages(values));
  });
};

export const onPageEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    if (!route.params?.id) return ;

    // clear the prev state first
    dispatch(clearPageSlice());

    const page = await getPage(route.params?.id, ['categories']);

    if (!page) return;

    dispatch(loadPageSlice((page as Parse.Attributes).toJSON()));
  });
};

export const onEditPageEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canGet = canAccessTo(roles, 'Page', 'get');
    const canUpdate = canAccessTo(roles, 'Page', 'update');

    // redirect to not found page
    if (!canGet || !canUpdate) {
      route.navigate(goToNotFound());
      return;
    }

    if (!route.params?.id) return ;
    // clear the prev state first
    dispatch(clearPageSlice());

    const page = await getPage(route.params?.id, ['categories']);

    if (!page) return;

    dispatch(loadPageSlice((page as Parse.Attributes).toJSON()));
  });
};

export const onCreatePageEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Page', 'create');

    // redirect to not found page
    if (!hasRight) {
      route.navigate(goToNotFound());
      return;
    }

    dispatch(clearPageSlice());
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToPages = (searchParams?: ITabAndCategorySearchParams) => ({ to: PATH_NAMES.pages, search: searchParams });
export const goToPage = (id: string) => ({ to: PATH_NAMES.pages + '/$id', params: { id }});
export const goToAddPage = () => ({ to: PATH_NAMES.pages + '/' + PATH_NAMES.create });
export const goToEditPage = (id: string) => ({ to: PATH_NAMES.pages + '/$id/' + PATH_NAMES.edit, params: { id } });
