import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import Head from '@/components/Head';
import Items from '@/components/Items';
import Layout from '@/components/layouts/Layout';

import { PREVIEW_PAGE_GRID } from '@/utils/constants';
import { displayDate } from '@/utils/date.utils';

import { ISelectOption } from '@/types/app.type';
import UserInfo from '@/containers/users/UserInfos';
import { getInvoiceInvoiceSelector } from '@/redux/reducers/invoice.reducer';
import { deleteInvoice, downloadInvoicePDF, editInvoice, goToInvoice, goToInvoices } from '@/redux/actions/invoice.action';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import InvoiceMenus from './InvoiceMenus';
import Dialog from '@/components/Dialog';
import InvoiceForm from '@/containers/invoices/InvoiceForm';
import { InvoiceInput } from '@/types/invoice.type';
import { useToggle } from '@/hooks/useToggle';

const INVOICES_FORM_ID = 'send-email-form-id';

const Invoice = () => {
  const { t } = useTranslation(['common', 'user']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoice = useSelector(getInvoiceInvoiceSelector);
  const roles = useSelector(getRoleCurrentUserRolesSelector);
  const { open: isOpenEdition, toggle: toggleDialogEdition } = useToggle();

  const canDelete = canAccessTo(roles, 'Invoice', 'delete');
  const canPreview = canAccessTo(roles, 'Invoice', 'get');
  const canEdit = canAccessTo(roles, 'Invoice', 'edit');

  if (!invoice) return null;

  const infosItems: ISelectOption[] = [
    {
      label: t('common:invoices.reference'),
      value: invoice.reference,
    },
    {
      label: t('common:invoices.supplierName'),
      value: invoice.supplierName,
    },
    {
      label: t('common:createdAt'),
      value: displayDate(invoice.createdAt),
    },
    {
      label: t('common:updatedAt'),
      value: displayDate(invoice.updatedAt),
    },
  ];

  const estimateItems: ISelectOption[] = [
    {
      label: t('common:link'),
      value: displayDate(invoice.estimate.url),
    },
    {
      label: t('common:invoice.createdAt'),
      value: displayDate(invoice.estimate.createdAt),
    },
    {
      label: t('common:invoice.updatedAt'),
      value: displayDate(invoice.estimate.updatedAt),
    },
  ];

  const handleGoToList = () => {
    navigate(goToInvoices())
  };

  // for notification
  const handleDownload = () => {
    dispatch(downloadInvoicePDF(invoice.objectId));
  }

  const handlePreview = () => {
    if (!canPreview) return;
    navigate(goToInvoice(invoice.objectId));
  }

  const handleDelete = () => {
    if (!canDelete) return;
    navigate(deleteInvoice(invoice.objectId));
  }

  const handleEdit = (values: InvoiceInput) => {
    dispatch(editInvoice(invoice.objectId, values));
    toggleDialogEdition();
  };

  return (
    <Layout
      title={t('common:invoices.invoice')}
      isCard={false}
      actions={
        <InvoiceMenus
          onDelete={handleDelete}
          onPreview={handlePreview}
          onEdit={toggleDialogEdition}
          onDownloadPDF={handleDownload}
          goToList={handleGoToList}
          label={invoice.estimate.reference}
        />
      }>
      <Head title={t('common:invoices.reference')} />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        <Grid item {...PREVIEW_PAGE_GRID.left}>
          <Stack spacing={3}>
            <Layout cardTitle={t('common:details')}>
              <Items items={infosItems} />
            </Layout>

            <Layout cardTitle={t('common:estimates.estimate')}>
              <Items items={estimateItems} />
            </Layout>
          </Stack>
        </Grid>

        <Grid item {...PREVIEW_PAGE_GRID.right}>
          <Stack spacing={3}>
            <Layout  cardTitle={t('user:createdBy')}>
              <UserInfo user={invoice.createdBy} />
            </Layout>

            {invoice.updatedBy && invoice.updatedBy.objectId !== invoice.createdBy.objectId && (
              <Layout cardTitle={t('user:updatedBy')}>
                <UserInfo user={invoice.updatedBy} />
              </Layout>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        title={t('common:invoices.editInvoice', { value: invoice.reference })}
        open={canEdit && isOpenEdition}
        toggle={toggleDialogEdition}
        maxWidth="sm"
        fullWidth
        formId={INVOICES_FORM_ID}
      >
        <InvoiceForm
          formId={INVOICES_FORM_ID}
          onSubmit={handleEdit}
          invoice={invoice}
        />
      </Dialog>
    </Layout>
  );
};

export default Invoice;
