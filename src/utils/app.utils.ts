import i18n from '@/config/i18n';

import { endLoadingSlice, setErrorSlice, startLoadingSlice } from '@/redux/reducers/app.reducer';
import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';
import { ISelectOption } from '@/types/app.type';

// options for select input
export const booleanOptions: ISelectOption<boolean>[] = [
  {
    label: i18n.t('common:yes'),
    value: true,
  },
  {
    label: i18n.t('common:no'),
    value: false,
  },
];

export const orderSelectOptions: ISelectOption[] = [
  {
    value: 'asc',
    label: i18n.t('common:ascending'),
  },
  {
    value: 'desc',
    label: i18n.t('common:descending'),
  },
];

const translatedError = (text: string): string => {
  const hasDot = text.includes(':') && text.includes('.');
  if (hasDot) {
    return i18n.t(text);
  }

  return text;
};

/**
 * wrapper for thunk, return a thunk
 * @param longPromiseCreatorOrPromise
 * @returns
 */
export const actionWithLoader = (
  longPromiseCreatorOrPromise: AppThunkAction,
  localLoadingAction?: (value: boolean) => any,
): AppThunkAction => {
  return async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    // --------------- start loading --------------- //
    if (localLoadingAction) {
      dispatch(localLoadingAction(true));
    } else {
      dispatch(startLoadingSlice());
    }
    try {
      // --------------- dispatch action --------------- //
      await longPromiseCreatorOrPromise(dispatch, getState ?? undefined);
    } catch (error) {
      if (typeof error === 'string') {
        dispatch(setErrorSlice(translatedError(error)));
      } else if (error instanceof Error) {
        dispatch(setErrorSlice(translatedError((error as any).message)));
      }
    } finally {
      // --------------- end loading --------------- //
      if (localLoadingAction) {
        dispatch(localLoadingAction(false));
      } else {
        dispatch(endLoadingSlice());
      }
    }

    return Promise.resolve();
  };
};

/**
 * change tab name (search params) to database queries
 * ex: ?tab=new to { seen: false };
 * @param tab
 * @returns
 */
export const tabToFilters = (tab: string): Record<string, any> | void => {
  const values: Record<string, any> = {};
  if (tab === i18n.t('common:route.new')) {
    values.seen = false;
  }

  return values;
};
