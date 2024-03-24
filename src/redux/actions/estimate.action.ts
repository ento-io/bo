import Parse, { Attributes } from 'parse';

import { actionWithLoader } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { addEstimateToEstimatesSlice, deleteEstimateFromEstimatesSlice, deleteEstimatesSlice, loadEstimateSlice, loadEstimatesSlice, markEstimatesAsSeenSlice, setEstimatesCountSlice, updateEstimatesByEstimateSlice } from '../reducers/estimate.reducer';
import { getAppNotificationsSelector, setErrorSlice, setMessageSlice, setNotificationsSlice } from '../reducers/app.reducer';
import { setValues } from '@/utils/parse.utils';
import { EstimateInput, IEstimate } from '@/types/estimate.types';
import { DEFAULT_PAGINATION, PAGINATION } from '@/utils/constants';
import { IQueriesInput } from '@/types/app.type';
import { searchUserPointerQuery } from './user.action';
import { escapeText, isBoolean } from '@/utils/utils';
import { getRoleCurrentUserRolesSelector } from '../reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';

export const Estimate = Parse.Object.extend("Estimate");

const ESTIMATE_PROPERTIES = new Set(['url']);

export const getEstimate = async (id: string, include: 'updatedBy'[] = []): Promise<Parse.Object | undefined> => {
  const estimate = await new Parse.Query(Estimate)
    .equalTo('objectId', id)
    .notEqualTo('deleted', true)
    .include(['createdBy', ...include])
    .first();

  if (!estimate) {
    throw new Error("Estimate not found");
  }
  return estimate;
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //
export const loadEstimates = ({
  limit = PAGINATION.rowsPerPage,
  skip = 0,
  orderBy = 'updatedAt',
  order = 'desc',
  filters,
  search,
}: IQueriesInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const query = new Parse.Query(Estimate);

    // full text search
    // should be before all other queries
    if (search?.text) {
      // search estimate by user name or email
      await searchUserPointerQuery(query, search.text);
    }

    query.limit(+limit)
      .skip(+skip)
      .notEqualTo('deleted', true)
      .exists('createdBy')
      .include(['createdBy', 'updatedBy']);

    if (filters) {
      if (isBoolean(filters?.deleted)) {
        query.equalTo('deleted', filters.deleted);
      }

      if (isBoolean(filters?.seen)) {
        query.equalTo('seen', filters.seen);
      }
    }

    if (search) {
      if (search.message) {
        query.matches('lastName', escapeText(search.message));
      }
    }

    if (order === 'desc') {
      query.descending(orderBy);
    } else {
      query.ascending(orderBy);
    }

    const result: Record<string, any> = await query.withCount().find();

    // save estimates to store (in json)
    const estimatesJson = result.results.map((estimate: any) => estimate.toJSON());

    dispatch(loadEstimatesSlice(estimatesJson));
    dispatch(setEstimatesCountSlice(result.count));
  });
};


/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deleteEstimate = (id: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const estimate = await getEstimate(id);

    if (!estimate) return;

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    estimate.set('deleted', true);
    const deletedEstimate = await estimate.save();

    dispatch(deleteEstimateFromEstimatesSlice(deletedEstimate.id));
    dispatch(setMessageSlice(i18n.t('common:estimates.estimateDeletedSuccessfully', { value: deletedEstimate.get('reference') })));
  });
};

/**
 * mark seen field as true
 * so that its not more treated as notification
 * ex: (['xxx', 'xxxy'], seen, false)
 * @param ids
 * @returns
 */
export const toggleEstimatesByIds = (ids: string[], field: string, value = true): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const notification = getAppNotificationsSelector(state as any);
    const count = notification?.estimate ?? 0;

    const estimates = (state as any)?.estimate.estimates ?? [];

    // get only estimate as seen = false for the notifications update
    const estimateSeenIds: string[] = [];
    for (const id of ids) {
      if (estimates.find((estimate: IEstimate) => id === estimate.objectId && !estimate.seen)) {
        estimateSeenIds.push(id);
      }
    }

    // update the database
    await new Parse.Query(Estimate).containedIn('objectId', ids).each(async estimate => {
      estimate.set(field, value);

      await estimate.save();
    });

    const newCount = count - estimateSeenIds.length;

    // update notification count
    if (newCount >= 0) {
      dispatch(setNotificationsSlice({ estimate: newCount })); // in sidebar
    }

    //  ------------ update the list ------------ //
    // mark as seen
    if (field === 'seen') {
      dispatch(markEstimatesAsSeenSlice(ids));
      return;
    }

    // delete
    dispatch(deleteEstimatesSlice(ids));
  });
};

export const createEstimate = (values: EstimateInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const estimate = new Estimate()

    setValues(estimate, values, ESTIMATE_PROPERTIES);


    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedEstimate = await estimate.save();
    dispatch(addEstimateToEstimatesSlice((savedEstimate as Attributes).toJSON()));
    dispatch(setMessageSlice(i18n.t('common:estimates.estimateCreatedSuccessfully')));

  });
};

export const editEstimate = (id: string, values: EstimateInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const estimate = await getEstimate(id);

    if (!estimate) return;

    setValues(estimate, values, ESTIMATE_PROPERTIES);


    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const updatedEstimate = await estimate.save();
    dispatch(updateEstimatesByEstimateSlice(updatedEstimate.toJSON() as IEstimate));
    dispatch(setMessageSlice(i18n.t('common:estimates.estimateEditedSuccessfully', { value: updatedEstimate.get('reference') })));
  });
};

// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
export const onEstimatesEnter = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canFind = canAccessTo(roles, 'Estimate', 'find');

    // redirect to not found page
    if (!canFind) {
      dispatch(setErrorSlice(i18n.t('common:errors.accessDenied')));
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

    values.filters = filters;

    dispatch(loadEstimates(values));
  });
};

export const onEstimateEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    if (!route.params?.id) return ;

    const estimate = await getEstimate(route.params?.id, ['updatedBy']);

    if (!estimate) return;

    dispatch(loadEstimateSlice((estimate as Parse.Attributes).toJSON()));
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToEstimates = () => ({ to: PATH_NAMES.estimates });
export const goToEstimate = (id: string) => ({ to: PATH_NAMES.estimates + '/$id', params: { id }});
