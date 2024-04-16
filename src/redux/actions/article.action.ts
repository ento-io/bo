import Parse, { Attributes } from 'parse';

import { actionWithLoader, convertTabToFilters } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { clearArticleSlice, deleteArticleFromArticlesSlice, deleteArticlesSlice, loadArticleSlice, loadArticlesSlice, setArticlesCountSlice } from '../reducers/article.reducer';
import { setMessageSlice } from '../reducers/app.reducer';
import i18n, { locales } from '@/config/i18n';
import { IArticle, IArticleInput } from '@/types/article.type';
import { DEFAULT_PAGINATION, PAGINATION } from '@/utils/constants';
import { IQueriesInput, ITabAndCategorySearchParams } from '@/types/app.type';
import { goToNotFound } from './app.action';
import { getRoleCurrentUserRolesSelector } from '../reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import { ALL_PAGE_FIELDS, articlesTabOptions, getCategoryPointersFromIds } from '@/utils/cms.utils';
import { setValues } from '@/utils/parse.utils';
import { uploadFormFiles, uploadUpdatedFormFiles } from '@/utils/file.utils';

const Article = Parse.Object.extend("Article");

const ARTICLE_PROPERTIES = new Set(['translated', 'categories', ...ALL_PAGE_FIELDS]);

export const getArticle = async (id: string, include: string[] = []): Promise<Parse.Object | undefined> => {
  const article = await Parse.Cloud.run('getArticle', { id, include });


  if (!article) {
    throw new Error(i18n.t('cms:errors.articleNotFound'));
  }
  return article;
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //

export const loadArticles = ({
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
    const result: Record<string, any> = await Parse.Cloud.run('getArticles', {
      limit,
      skip,
      orderBy,
      order,
      filters,
      search,
      locales,
      include: ['categories'],
    });

    // save articles to store (in json)
    const articlesJson = result.results.map((article: any) => article.toJSON());

    dispatch(loadArticlesSlice(articlesJson));
    dispatch(setArticlesCountSlice(result.count));
  });
};

export const createArticle = (values: IArticleInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Article', 'create');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToCreate', { value: i18n.t('cms:thisArticle') }));
    }

    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) {
      throw Error(i18n.t('user:errors.userNotExist'));
    }

    const article = new Article()

    const uploadedValues = await uploadFormFiles<IArticle>({
      folder: 'articles',
      sessionToken: currentUser.getSessionToken(),
      values
    });

    if (values.categories) {
      values.categories = getCategoryPointersFromIds(values.categories);
    }

    const newValues = { ...values, ...uploadedValues };
    
    setValues(article, newValues, ARTICLE_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedArticle = await article.save();
    dispatch(loadArticleSlice((savedArticle as Attributes).toJSON()));
  });
};

export const editArticle = (id: string, values: IArticleInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Article', 'update');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToUpdate', { value: i18n.t('cms:thisArticle') }));
    }

    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) {
      throw Error(i18n.t('user:errors.userNotExist'));
    }

    const article = await getArticle(id);

    if (!article) return;
    
    const uploadedValues = await uploadUpdatedFormFiles<IArticle>({
      page: article,
      folder: 'articles',
      sessionToken: currentUser.getSessionToken(),
      values
    });

    if (values.categories) {
      values.categories = getCategoryPointersFromIds(values.categories);
    }

    const newValues = { ...values, ...uploadedValues };

    setValues(article, newValues, ARTICLE_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedArticle = await article.save();
    dispatch(loadArticleSlice((savedArticle as Attributes).toJSON()));
  });
};

/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deleteArticle = (id: string,): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Article', 'delete');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToDelete', { value: i18n.t('cms:thisArticle') }));
    }

    // --------- request --------- //
    const article = await getArticle(id);
    if (!article) return;

    // --------- update database --------- //
    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    article.set('deleted', true);
    const deletedArticle = await article.save();

    // --------- update store --------- //
    dispatch(deleteArticleFromArticlesSlice(deletedArticle.id));
    dispatch(setMessageSlice(i18n.t('cms:messages.articleDeletedSuccessfully', { value: deletedArticle.id })));
  });
};

/**
 * mark seen field as true
 * so that its not more treated as notification
 * ex: (['xxx', 'xxxy'], seen, false)
 * @param ids
 * @returns
 */
export const toggleArticlesByIds = (ids: string[], field: string, value = true): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const isDelete = field === 'deleted';
    const hasRight = canAccessTo(roles, 'Article', isDelete ? 'delete' : 'update');

    if (!hasRight) {
      if (isDelete) {
        throw Error(i18n.t('common:errors.hasNoRightToDelete', { value: i18n.t('cms:theseArticles') }));
      } else {
        throw Error(i18n.t('common:errors.hasNoRightToUpdate', { value: i18n.t('cms:theseArticles') }));
      }
    }

    // update the database
    await new Parse.Query(Article).containedIn('objectId', ids).each(async article => {
      article.set(field, value);

      await article.save();
    });
    // delete
    dispatch(deleteArticlesSlice(ids));
  });
};

// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
/**
 * load articles data from database before the page is loaded (in route)
 * then load it to the store
 * @param route 
 * @returns 
 */
export const onArticlesEnter = (route: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Article', 'find');

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
    const newFilters = convertTabToFilters(articlesTabOptions, route.search.tab, filters);
    values.filters = newFilters;

    // clear the prev state first
    dispatch(clearArticleSlice());
    dispatch(loadArticles(values));
  });
};

export const onArticleEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    if (!route.params?.id) return ;

    // clear the prev state first
    dispatch(clearArticleSlice());

    const article = await getArticle(route.params?.id, ['categories']);

    if (!article) return;

    dispatch(loadArticleSlice((article as Parse.Attributes).toJSON()));
  });
};

export const onEditArticleEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canGet = canAccessTo(roles, 'Article', 'get');
    const canUpdate = canAccessTo(roles, 'Article', 'update');

    // redirect to not found page
    if (!canGet || !canUpdate) {
      route.navigate(goToNotFound());
      return;
    }

    if (!route.params?.id) return ;
    // clear the prev state first
    dispatch(clearArticleSlice());

    const article = await getArticle(route.params?.id, ['categories']);

    if (!article) return;

    dispatch(loadArticleSlice((article as Parse.Attributes).toJSON()));
  });
};

export const onCreateArticleEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Article', 'create');

    // redirect to not found page
    if (!hasRight) {
      route.navigate(goToNotFound());
      return;
    }

    dispatch(clearArticleSlice());
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToArticles = (searchParams?: ITabAndCategorySearchParams) => ({ to: PATH_NAMES.articles, search: searchParams });
export const goToArticle = (id: string) => ({ to: PATH_NAMES.articles + '/$id', params: { id }});
export const goToAddArticle = () => ({ to: PATH_NAMES.articles + '/' + PATH_NAMES.create });
export const goToEditArticle = (id: string) => ({ to: PATH_NAMES.articles + '/$id/' + PATH_NAMES.edit, params: { id } });
