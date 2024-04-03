import { Stack, Theme } from '@mui/material';
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
import { deleteInvoice, generateAndDownloadInvoicePDF, editInvoice, goToInvoice, goToInvoices, regenerateInvoicePDF } from '@/redux/actions/invoice.action';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import InvoiceMenus from '../../containers/invoices/InvoiceMenus';
import Dialog from '@/components/Dialog';
import InvoiceForm from '@/containers/invoices/InvoiceForm';
import { IInvoice, InvoiceInput } from '@/types/invoice.type';
import { useToggle } from '@/hooks/useToggle';
import InvoiceStatus from '@/containers/invoices/InvoiceStatus';
import UsersForEntity from '@/containers/users/UsersForEntity';
import EstimateStatus from '@/containers/estimates/EstimateStatus';

const classes = {
  reference: (theme: Theme) => ({
    color: theme.palette.info.main,
    marginRight: 20,
    fontSize: 20,
    fontWeight: 600,
  }),
};

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
      value: <a href={invoice.estimate.url}>{invoice.estimate.url}</a> as any,
    },
    {
      label: 'Status',
      value: <EstimateStatus status={invoice.estimate.status} />,
    },
    {
      label: t('common:createdAt'),
      value: displayDate(invoice.estimate.createdAt),
    },
    {
      label: t('common:updatedAt'),
      value: displayDate(invoice.estimate.updatedAt),
    },
    {
      label: t('common:deletedAt'),
      value: displayDate(invoice.estimate.deletedAt),
      hide: !invoice.deletedAt
    },
  ];

  const handleGoToList = () => {
    navigate(goToInvoices())
  };

  // for notification
  const handleDownload = () => {
    dispatch(generateAndDownloadInvoicePDF(invoice.objectId));
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

  const handleRegenerate = () => {
    dispatch(regenerateInvoicePDF(invoice.objectId));
  }

  return (
    <Layout
      title={(
        <>
          <span css={{ marginRight: 10 }}>{t('common:invoices.invoice')}</span>
          <span css={classes.reference}>#{invoice.reference}</span>
          <InvoiceStatus status={invoice.status} />
        </>
      )}
      isCard={false}
      actions={
        <InvoiceMenus
          onDelete={handleDelete}
          onPreview={handlePreview}
          onEdit={toggleDialogEdition}
          onDownloadPDF={handleDownload}
          goToList={handleGoToList}
          onRegeneratePDF={handleRegenerate}
          label={invoice.estimate.reference}
        />
      }>
      <Head title={t('common:estimates.reference')} />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        {/* left */}
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

        {/* right */}
        <Grid item {...PREVIEW_PAGE_GRID.right}>
          <Stack spacing={3}>
            <Layout cardTitle={t('user:user')}>
              <UserInfo user={invoice.user} />
            </Layout>
          </Stack>
        </Grid>

        {/* bottom */}
        <UsersForEntity<IInvoice, ISelectOption<('createdBy' | 'updatedBy' | 'deletedBy')>[]>
          object={invoice}
          keys={[{
            label: t('user:createdBy'),
            value: 'createdBy',
          }, {
            label: t('user:updatedBy'),
            value: 'updatedBy',
          }, {
            label: t('user:deletedBy'),
            value: 'deletedBy',
          }]}
        />
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
