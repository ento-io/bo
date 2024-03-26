import { ReactNode, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { clearInvoiceErrorSlice, getInvoiceCountSelector, getInvoiceErrorSelector, getInvoiceFiltersSelector, getInvoiceInvoicesSelector } from '@/redux/reducers/invoice.reducer';
import { createInvoice, deleteInvoice, editInvoice, goToInvoice, loadInvoices, toggleInvoicesByIds } from '@/redux/actions/invoice.action';
import List from '@/components/table/List';
import { displayDate } from '@/utils/date.utils';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IQueriesInput, TableHeadCell } from '@/types/app.type';
import ButtonActions from '@/components/ButtonActions';
import Head from '@/components/Head';
import SearchInput from '@/components/form/inputs/SearchInput';
import { invoicesRoute } from '@/routes/protected/invoice.routes';
import Dialog from '@/components/Dialog';
import UserCell from '@/components/UserCell';
import { InvoiceInput, IInvoice } from '@/types/invoice.type';
import InvoiceForm from '../../containers/invoices/InvoiceForm';
import InvoiceAdvancedFilterForm from '@/containers/invoices/InvoiceAdvancedFilterForm';
import AddFab from '@/components/AddFab';
import { useToggle } from '@/hooks/useToggle';

const INVOICES_FORM_ID = 'send-email-form-id'

interface Data {
  reference: string;
  supplierName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: ReactNode;
  actions: ReactNode;
}

const headCells: TableHeadCell<keyof Data>[] = [
  {
    id: 'reference',
    numeric: false,
    disablePadding: false,
    label: i18n.t('common:estimates.reference'),
  },
  {
    id: 'supplierName',
    numeric: false,
    disablePadding: false,
    label: i18n.t('common:link'),
  },
  {
    id: 'createdBy',
    numeric: false,
    disablePadding: false,
    label: i18n.t('user:createdBy'),
  },
  {
    id: 'updatedBy',
    numeric: false,
    disablePadding: false,
    label: i18n.t('user:updatedBy'),
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: i18n.t('common:createdAt'),
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

const Invoices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoices = useSelector(getInvoiceInvoicesSelector);
  const count = useSelector(getInvoiceCountSelector);
  const filters = useSelector(getInvoiceFiltersSelector);
  const searchParams = invoicesRoute.useSearch()

  const roles = useSelector(getRoleCurrentUserRolesSelector);
  const error = useSelector(getInvoiceErrorSelector);
  const canCreate = canAccessTo(roles, 'Contact', 'create');

  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const { open: isOpenCreation, toggle: toggleOpenCreation } = useToggle();

  const { t } = useTranslation();

  // delete a row
  const onDelete = useCallback(
    (invoice: IInvoice): void => {
      dispatch(deleteInvoice(invoice.objectId));
    },
    [dispatch],
  );

  // go to preview page
  const onPreview = useCallback(
    (id: string): void => {
      navigate(goToInvoice(id));
    },
    [navigate],
  );

  const onEdit = useCallback(
    (invoice: IInvoice): void => {
      setSelectedInvoice(invoice);
      toggleOpenCreation();
    },
    [toggleOpenCreation],
  );

  // delete selected rows
  const handleDeleteSelected = async (ids: string[]): Promise<void | undefined> => {
    dispatch(toggleInvoicesByIds(ids, 'deleted', false));
  };

  const handleCloseDialog = () => {
    setSelectedInvoice(null);
    toggleOpenCreation();
  };

  const handleFormSubmit = (values: InvoiceInput) => {
    // edit
    if (selectedInvoice) {
      dispatch(editInvoice(selectedInvoice.objectId, values));
      handleCloseDialog();
      return;
    }

    // create
    dispatch(createInvoice(values));
    handleCloseDialog();
  };

  const onUpdateData = (queries: IQueriesInput) => {
    const newQueries = { ...queries, filters: { ...filters, ...queries.filters } };
    dispatch(loadInvoices(newQueries))
  }

  // table data
  const dataTable = useMemo((): Data[] => {
    const canDelete = canAccessTo(roles, 'Invoice', 'delete');
    const canPreview = canAccessTo(roles, 'Invoice', 'get');
    const canEdit = canAccessTo(roles, 'Invoice', 'edit');

    const invoicesData = invoices.map((invoice: IInvoice) => {
      // default data
      const data: Record<string, any> = {
        reference: invoice.estimate.reference,
        supplierName: invoice.supplierName,
        createdBy: <UserCell user={invoice.createdBy} />,
        updatedBy: invoice.updatedBy ? <UserCell user={invoice.updatedBy} /> : '-',
        createdAt: displayDate(invoice.createdAt, false, true),
        actions:(
          <ButtonActions
            onDelete={canDelete ? () => onDelete(invoice) : undefined}
            onPreview={canPreview ? () => onPreview(invoice.objectId) : undefined}
            onEdit={canEdit ? () => onEdit(invoice) : undefined}
            value={invoice.estimate.reference}
          />
        )
      };

      return data as Data;
    });

    return invoicesData;
  }, [invoices, onDelete, onPreview, roles, onEdit]);

  const handleCloseErrorDialog = () => {
    dispatch(clearInvoiceErrorSlice());
  }

  return (
    <>
      <Head title="Invoices" />
      <List
        // @see invoices.routes.tsx for search params definition
        defaultFilters={searchParams}
        onUpdateData={onUpdateData}
        items={dataTable}
        onDeleteSelected={handleDeleteSelected}
        headCells={headCells}
        count={count}
        canDelete={canAccessTo(roles, 'Invoice', 'delete')}
        canUpdate={canAccessTo(roles, 'Invoice', 'update')}
        renderFilter={(
          onSearch: (search: string) => void,
          onAdvancedSearch: (values: Record<string, any>) => void
        ) => (
          <>
            <SearchInput onChange={onSearch} placeholder={t('user:searchByNameOrEmail')} />
            <InvoiceAdvancedFilterForm onSubmit={onAdvancedSearch} />
          </>
        )}
      />

      {canCreate && (
        <AddFab
          onClick={() => {
            setSelectedInvoice(null);
            toggleOpenCreation();
          }}
        />
      )}

      <Dialog
        title={selectedInvoice ? t('common:invoices.editInvoice', { value: selectedInvoice.reference }) : t('common:invoices.createInvoice')}
        open={!!selectedInvoice || isOpenCreation}
        toggle={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        formId={INVOICES_FORM_ID}
      >
        <InvoiceForm
          formId={INVOICES_FORM_ID}
          onSubmit={handleFormSubmit}
          invoice={selectedInvoice}
        />
      </Dialog>

      {/* if an invoice with this reference exists */}
      <Dialog
        description={t(error)}
        title={t('common:alreadyExists')}
        open={!!error}
        withCancelButton={false}
        primaryButtonText="Ok"
        onPrimaryButtonAction={handleCloseErrorDialog}
        toggle={handleCloseErrorDialog}
        maxWidth="xs"
      />
    </>
  );
}

export default Invoices;
