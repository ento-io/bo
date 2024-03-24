import Parse, { Attributes } from 'parse';

import { actionWithLoader } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { addInvoiceToInvoicesSlice, deleteInvoiceFromInvoicesSlice, deleteInvoicesSlice, loadInvoiceSlice, loadInvoicesSlice, setInvoicesCountSlice, updateInvoicesByInvoiceSlice } from '../reducers/invoice.reducer';
import { setErrorSlice, setMessageSlice } from '../reducers/app.reducer';
import { setValues } from '@/utils/parse.utils';
import { DEFAULT_PAGINATION, PAGINATION } from '@/utils/constants';
import { IQueriesInput } from '@/types/app.type';
import { searchUserPointerQuery } from './user.action';
import { isBoolean } from '@/utils/utils';
import { getRoleCurrentUserRolesSelector } from '../reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IInvoice, InvoiceInput } from '@/types/invoice.type';
import { Estimate, loadEstimates } from './estimate.action';

const Invoice = Parse.Object.extend('Invoice');

const INVOICE_PROPERTIES = new Set(['supplierName', 'estimate']);

export const getInvoice = async (id: string, include: string[] = []): Promise<Parse.Object | undefined> => {
  const invoice = await new Parse.Query(Invoice)
    .equalTo('objectId', id)
    .notEqualTo('deleted', true)
    .include(['estimate', ...include])
    .first();

  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return invoice;
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //
export const loadInvoices = ({
  limit = PAGINATION.rowsPerPage,
  skip = 0,
  orderBy = 'updatedAt',
  order = 'desc',
  filters,
  search,
}: IQueriesInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const query = new Parse.Query(Invoice);

    // full text search
    // should be before all other queries
    if (search?.text) {
      // search invoice by user name or email
      await searchUserPointerQuery(query, search.text);
    }

    query.limit(+limit)
      .skip(+skip)
      .exists('estimate')
      .include(['estimate', 'estimate.createdBy', 'estimate.updatedBy']);

    if (filters) {
      if (isBoolean(filters?.deleted)) {
        query.equalTo('deleted', filters.deleted);
      }
    }

    if (order === 'desc') {
      query.descending(orderBy);
    } else {
      query.ascending(orderBy);
    }

    const result: Record<string, any> = await query.withCount().find();

    // save invoices to store (in json)
    const invoicesJson = result.results.map((invoice: any) => invoice.toJSON());

    dispatch(loadInvoicesSlice(invoicesJson));
    dispatch(setInvoicesCountSlice(result.count));
  });
};


/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deleteInvoice = (id: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const invoice = await getInvoice(id);

    if (!invoice) return;

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    invoice.set('deleted', true);
    const deletedInvoice = await invoice.save();

    dispatch(deleteInvoiceFromInvoicesSlice(deletedInvoice.id));
    dispatch(setMessageSlice(i18n.t('common:invoices.invoiceDeletedSuccessfully', { value: deletedInvoice.get('reference') })));
  });
};

/**
 * mark seen field as true
 * so that its not more treated as notification
 * ex: (['xxx', 'xxxy'], seen, false)
 * @param ids
 * @returns
 */
export const toggleInvoicesByIds = (ids: string[], field: string, value = true): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    // update the database
    await new Parse.Query(Invoice).containedIn('objectId', ids).each(async invoice => {
      invoice.set(field, value);

      await invoice.save();
    });

    // delete
    dispatch(deleteInvoicesSlice(ids));
  });
};

export const createInvoice = (values: InvoiceInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const invoice = new Invoice();

    const newValues = { ...values };
    const estimate = new Estimate();
    estimate.id = values.estimate;
    newValues.estimate = estimate;
    setValues(invoice, newValues, INVOICE_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedInvoice = await invoice.save();
    dispatch(addInvoiceToInvoicesSlice((savedInvoice as Attributes).toJSON()));
    dispatch(setMessageSlice(i18n.t('common:invoices.invoiceCreatedSuccessfully')));

  });
};

export const editInvoice = (id: string, values: InvoiceInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const invoice = await getInvoice(id);

    if (!invoice) return;

    setValues(invoice, values, INVOICE_PROPERTIES);


    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const updatedInvoice = await invoice.save();
    dispatch(updateInvoicesByInvoiceSlice(updatedInvoice.toJSON() as IInvoice));
    dispatch(setMessageSlice(i18n.t('common:invoices.invoiceEditedSuccessfully', { value: updatedInvoice.get('reference') })));
  });
};

// ---------------------------------------- //
// ------------- on page load ------------- //
// ---------------------------------------- //
export const onInvoicesEnter = (): any => {
  return actionWithLoader(async (dispatch: AppDispatch,  getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const canFind = canAccessTo(roles, 'Invoice', 'find');

    dispatch(loadEstimates({
      skip: 0,
      limit: 1000,
    }));

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

    dispatch(loadInvoices(values));
  });
};

export const onInvoiceEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    if (!route.params?.id) return ;

    const invoice = await getInvoice(route.params?.id, ['createdBy', 'updatedBy', 'estimate.updatedBy', 'estimate.createdBy']);

    if (!invoice) return;

    dispatch(loadInvoiceSlice((invoice as Parse.Attributes).toJSON()));
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToInvoices = () => ({ to: PATH_NAMES.invoices });
export const goToInvoice = (id: string) => ({ to: PATH_NAMES.invoices + '/$id', params: { id }});
