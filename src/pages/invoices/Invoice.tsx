import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import ActionsMenu from '@/components/ActionsMenu';
import Head from '@/components/Head';
import Items from '@/components/Items';
import Layout from '@/components/layouts/Layout';

import { toggleUserNotification } from '@/redux/actions/user.action';

import { PREVIEW_PAGE_GRID } from '@/utils/constants';
import { displayDate } from '@/utils/date.utils';

import { ISelectOption } from '@/types/app.type';
import UserInfo from '@/containers/users/UserInfos';
import { getInvoiceInvoiceSelector } from '@/redux/reducers/invoice.reducer';
import { goToInvoices } from '@/redux/actions/invoice.action';

const Invoice = () => {
  const { t } = useTranslation(['common', 'user']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoice = useSelector(getInvoiceInvoiceSelector);

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
  const handleMarkAsSeen = () => {
    dispatch(toggleUserNotification(invoice.objectId));
  };

  return (
    <Layout
      title={t('common:invoices.invoice')}
      isCard={false}
      actions={
        <ActionsMenu label={invoice.lastName} goToList={handleGoToList} onMarkAsSeen={handleMarkAsSeen} />
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
    </Layout>
  );
};

export default Invoice;
