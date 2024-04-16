import Parse, { Attributes } from 'parse';

import { actionWithLoader, convertTabToFilters } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { clearCategorySlice, deleteCategoryFromCategoriesSlice, deleteCategoriesSlice, loadCategorySlice, loadCategoriesSlice, setCategoriesCountSlice, addCategoryTCategoriesSlice } from '../reducers/category.reducer';
import { setMessageSlice } from '../reducers/app.reducer';
import i18n, { locales } from '@/config/i18n';
import { DEFAULT_PAGINATION, PAGINATION } from '@/utils/constants';
import { IQueriesInput, ITabSearchParams } from '@/types/app.type';
import { getRoleCurrentUserRolesSelector } from '../reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import { setValues } from '@/utils/parse.utils';
import { CategoryEntityEnum, ICategory, ICategoryInput, ICategoryTypeEntity } from '@/types/category.types';
import { categoriesTabOptions } from '@/utils/cms.utils';
import { goToNotFound } from './app.action';
import { escapeText } from '@/utils/utils';

export const Category = Parse.Object.extend("Category");

const CATEGORY_PROPERTIES = new Set(['translated', 'active', 'entity']);

export const getCategory = async (id: string, include: string[] = []): Promise<Parse.Object | undefined> => {
  const article = await Parse.Cloud.run('getCategory', { id, include });


  if (!article) {
    throw new Error(i18n.t('cms:errors.categoryNotFound'));
  }
  return article;
}

/**
 * search a category for an entity
 * ex: article, page, product
 * @param search 
 * @param entity 
 * @returns 
 */
export const searchCategoriesForAutocomplete = async (search: string, entity: ICategoryTypeEntity = CategoryEntityEnum.Article): Promise<ICategory[]> => {
  let query = new Parse.Query(Category);

  // search by translated texts
  if (search) {
    const text = escapeText(search);
    const or: any[] = [];

    locales.forEach((locale: string) => {
      or.push(
        // ex: translated.fr.name = "Littérature"
        new Parse.Query(Category).matches('translated.' + locale + '.name', text),
      );
    });

    query = Parse.Query.or(...or);
  }

  const categories =  await query
    .equalTo('deleted', false)
    .equalTo('active', true)
    .equalTo('entity', entity)
    .limit(100)
    .select('translated')
    .find();

  return categories.map((category: any) => category.toJSON() as ICategory);
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //

export const loadCategories = ({
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
    const result: Record<string, any> = await Parse.Cloud.run('getCategories', {
      limit,
      skip,
      orderBy,
      order,
      filters,
      search,
      locales,
    });

    // save categories to store (in json)
    const categoriesJson = result.results.map((category: any) => category.toJSON());

    dispatch(loadCategoriesSlice(categoriesJson));
    dispatch(setCategoriesCountSlice(result.count));
  });
};

export const createCategory = (values: ICategoryInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Category', 'create');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToCreate', { value: i18n.t('cms:category.thisCategory') }));
    }

    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) {
      throw Error(i18n.t('user:errors.userNotExist'));
    }

    const category = new Category()
  
    setValues(category, values, CATEGORY_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedCategory = await category.save();
    dispatch(addCategoryTCategoriesSlice((savedCategory as Attributes).toJSON()));
    dispatch(setMessageSlice(i18n.t('cms:category.categoryAddedSuccessfully')));
  });
};

export const editCategory = (id: string, values: ICategoryInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Category', 'update');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToUpdate', { value: i18n.t('cms:category.thisCategory') }));
    }

    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) {
      throw Error(i18n.t('user:errors.userNotExist'));
    }

    const category = await getCategory(id);

    if (!category) return;
    
    setValues(category, values, CATEGORY_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const updatedCategory = await category.save();
    // ------- update store ------ //
    dispatch(loadCategorySlice(updatedCategory.toJSON() as ICategory));
    dispatch(setMessageSlice(i18n.t('cms:category.categoryEditedSuccessfully')));
  });
};

/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deleteCategory = (id: string,): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Category', 'delete');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToDelete', { value: i18n.t('cms:category.categoryDeletedSuccessfully') }));
    }

    // --------- request --------- //
    const category = await getCategory(id);
    if (!category) return;

    // --------- update database --------- //
    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    category.set('deleted', true);
    const deletedCategory = await category.save();

    // --------- update store --------- //
    dispatch(deleteCategoryFromCategoriesSlice(deletedCategory.id));
    dispatch(setMessageSlice(i18n.t('cms:messages.articleDeletedSuccessfully', { value: deletedCategory.id })));
  });
};

/**
 * mark seen field as true
 * so that its not more treated as notification
 * ex: (['xxx', 'xxxy'], seen, false)
 * @param ids
 * @returns
 */
export const toggleCategoriesByIds = (ids: string[], field: string, value = true): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const isDelete = field === 'deleted';
    const hasRight = canAccessTo(roles, 'Category', isDelete ? 'delete' : 'update');

    if (!hasRight) {
      if (isDelete) {
        throw Error(i18n.t('common:errors.hasNoRightToDelete', { value: i18n.t('cms:category.theseCategories') }));
      } else {
        throw Error(i18n.t('common:errors.hasNoRightToUpdate', { value: i18n.t('cms:category.theseCategories') }));
      }
    }

    // update the database
    await new Parse.Query(Category).containedIn('objectId', ids).each(async category => {
      category.set(field, value);

      await category.save();
    });
    // delete
    dispatch(deleteCategoriesSlice(ids));
  });
};

// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
/**
 * load categories data from database before the page is loaded (in route)
 * then load it to the store
 * @param route 
 * @returns 
 */
export const onCategoriesEnter = (route?: any): any => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Category', 'find');

    // redirect to not found page
    if (!hasRight) {
      throw new Error(i18n.t('common:errors.hasNoRightToFind', { value: i18n.t('cms:category.theseCategories') }));
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

    // convert the url search params tab to (db) filters
    const newFilters = convertTabToFilters(categoriesTabOptions, route.search.tab, filters);
    values.filters = newFilters;


    // clear the prev state first
    dispatch(clearCategorySlice());
    dispatch(loadCategories(values));
  });
};

/**
 * load category data by its id from database before the page is loaded (in route)
 * then load it to the store
 * @param route 
 * @returns 
 */
export const onCategoryEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canPreview = canAccessTo(roles, 'Category', 'get');
    const { id } = route.params;

    // clear the prev state first
    dispatch(clearCategorySlice());

    // redirect to not found page
    if (!canPreview || !id) {
      route.navigate(goToNotFound());
      return;
    }

    const category = await getCategory(id, ['updatedBy', 'user']);
    if (!category) {
      route.navigate(goToNotFound());
      return;
    };

    dispatch(loadCategorySlice((category as Parse.Attributes).toJSON()));
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToCategories = (search?: ITabSearchParams) => ({ to: PATH_NAMES.categories, search });

export const goToCategory = (id: string) => ({ to: PATH_NAMES.categories + '/$id', params: { id }});
