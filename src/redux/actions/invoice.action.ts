import Parse, { Attributes } from 'parse';

import { actionWithLoader } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { addInvoiceToInvoicesSlice, deleteInvoiceFromInvoicesSlice, deleteInvoicesSlice, loadInvoiceSlice, loadInvoicesSlice, setInvoiceErrorSlice, setInvoicesCountSlice, updateInvoicesByInvoiceSlice } from '../reducers/invoice.reducer';
import { setErrorSlice, setMessageSlice } from '../reducers/app.reducer';
import { setValues } from '@/utils/parse.utils';
import { DEFAULT_PAGINATION, PAGINATION, SERVER_CUSTOM_ERROR_CODES } from '@/utils/constants';
import { IQueriesInput } from '@/types/app.type';
import { getRoleCurrentUserRolesSelector } from '../reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IInvoice, InvoiceInput } from '@/types/invoice.type';
import { Estimate, loadEstimates } from './estimate.action';
import { downloadInvoicePDFApi } from '@/api/invoice.api';

const Invoice = Parse.Object.extend('Invoice');

const INVOICE_PROPERTIES = new Set(['supplierName', 'estimate']);

export const getInvoice = async (id: string, include: string[] = []): Promise<Parse.Object | undefined> => {
  const invoice = await new Parse.Query(Invoice)
    .equalTo('objectId', id)
    .equalTo('deleted', false)
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
    // result with count
    // we make it server side because we need to get user infos
    const result: Record<string, any> = await Parse.Cloud.run('getInvoices', {
      limit,
      skip,
      orderBy,
      order,
      filters,
      search,
    });

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

/**
 * download invoice pdf
 * @param invoiceId 
 * @returns 
 */
export const downloadInvoicePDF = (invoiceId: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const currentUser = await Parse.User.currentAsync();
    if (!currentUser) return;

    const invoice = await getInvoice(invoiceId);
    if (!invoice) return;
    
    await downloadInvoicePDFApi({
      sessionToken: currentUser.getSessionToken(),
      id: invoiceId,
      reference: invoice.get('reference')
    })

    await dispatch(setMessageSlice(i18n.t('common:invoices.invoiceDownloadedSuccessfully', { value: invoice.get('reference') })));
  });
};

/**
 * regenerate invoice pdf and save it
 * delete the old one
 * @param id 
 * @returns 
 */
export const regenerateInvoicePDF = (id: string): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const currentUser = await Parse.User.currentAsync();
    if (!currentUser) return;

    const invoice = await Parse.Cloud.run('regenerateInvoicePDF', { id })

    if (!invoice) return;
    
    await downloadInvoicePDFApi({
      sessionToken: currentUser.getSessionToken(),
      id,
      reference: invoice.get('reference')
    })

    await dispatch(setMessageSlice(i18n.t('common:invoices.invoiceDownloadedSuccessfully', { value: invoice.get('reference') })));
  });
};

export const regenerateInvoicePDFs = (ids: string[]): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void> => {
    const currentUser = await Parse.User.currentAsync();
    if (!currentUser) return;

    const count = await Parse.Cloud.run('regenerateInvoicePDFs', { ids })

    await dispatch(setMessageSlice(i18n.t('common:invoices.countRegeneratedSuccessfully', { count })));
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
    try {
      const savedInvoice = await invoice.save();
      dispatch(addInvoiceToInvoicesSlice((savedInvoice as Attributes).toJSON()));
      await dispatch(setMessageSlice(i18n.t('common:invoices.invoiceCreatedSuccessfully')));
  
      dispatch(downloadInvoicePDF(savedInvoice.id));
    } catch (error) {
      // use local error instead of the global app error in actionWithLoader() in app.utils.ts
      // we use this to display a dialog instead of a global snackbar
      if ((error as Error).message === SERVER_CUSTOM_ERROR_CODES.invoiceAlreadyExists) {
        dispatch(setInvoiceErrorSlice(i18n.t('common:invoices.thisInvoiceAlreadyExists')));
      }
    }
  });
};

export const editInvoice = (id: string, values: InvoiceInput): any => {
  return actionWithLoader(async (dispatch: AppDispatch): Promise<void | undefined> => {
    const invoice = await getInvoice(id);

    if (!invoice) return;
    const newValues = { ...values };

    // the estimate can not be changed, so we delete it
    delete (newValues as Partial<InvoiceInput>).estimate;

    setValues(invoice, newValues, INVOICE_PROPERTIES);


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
