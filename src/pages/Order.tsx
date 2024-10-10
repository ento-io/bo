import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import Head from '@/components/Head';
import Items from '@/components/Items';
import Layout from '@/components/layouts/Layout';

import { getAppCurrentUserSelector } from '@/redux/reducers/app.reducer';

import { PREVIEW_PAGE_GRID } from '@/utils/constants';
import { ISelectOption } from '@/types/app.type';
import { getInvoiceInvoiceSelector } from '@/redux/reducers/invoice.reducer';
import { confirmOrderAction, getInvoice } from '@/redux/actions/invoice.action';
import { AppDispatch } from '@/redux/store';

const Order = () => {
  const user = useSelector(getAppCurrentUserSelector);
  const invoice = useSelector(getInvoiceInvoiceSelector);
  const { t } = useTranslation();
  
  const title = t('common:yourOrder');
  const dispatch = useDispatch<AppDispatch>();

  const [invoiceDetails, setInvoiceDetails] = useState({
    supplierName: '',
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (invoice) {
        try {
          const invoices = await getInvoice(invoice.objectId);
          const supplierName = invoices?.get('supplierName');
          const quantity = invoices?.get('quantity');
          const price = invoices?.get('unitPrice');

          setInvoiceDetails({
            supplierName,
            quantity,
            price,
          });
        } catch (error) {
          console.error('Error fetching invoice details:', error);
        }
      }
    };

    fetchInvoiceDetails();
  }, [invoice]);


  const userDetailsItems : ISelectOption<string | undefined>[] = [
    {
      label: t('common:name'),
      value: "Ento.io",
    },
    {
      label: t('user:address'),
      value: "Ambohitsoa Tàna 101",
    },
    {
      label: t('user:phoneNumber'),
      value: "+231 38 45 456 78",
    },
  ];

  const accountInformationItems : ISelectOption<string | ReactNode>[] = [
    {
      label: t('user:firstName'),
      value: user.firstName,
    },
    {
      label: t('user:lastName'),
      value: user.lastName,
    },
    {
      label: t('user:email'),
      value: user.email,
    },
  ];

  const orderInformationItems: ISelectOption<string | number>[] = [
    {
      label: t('common:quantity'),
      value: invoiceDetails.quantity,
    },
    {
      label: t('common:price'),
      value: invoiceDetails.price,
    },
    {
      label: t('route:articles'),
      value: "",
    }
  ];

  const handleSubmit = async () => {
    try {
      await dispatch(confirmOrderAction(invoice?.objectId));
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };
  return (
    <Layout isCard={false} title={title}>
      <Head title={title} />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        <Grid item {...PREVIEW_PAGE_GRID.left}>
          <Stack spacing={3}>
            <Layout
              cardTitle={t('user:companyName')}
              actionsEmplacement="content">
              <Items items={userDetailsItems} />
            </Layout>
            <Layout cardTitle={t('user:customerName')}>
              <Items items={accountInformationItems} />
            </Layout>
            <Layout cardTitle={t('common:detailsOrder')}>
              <Items items={orderInformationItems} />
            </Layout>
          </Stack>
        </Grid>
        <Grid item {...PREVIEW_PAGE_GRID.right} sx={{ order: { xs: -1, lg: 1 } }}>
          <Button
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {t('common:confirmOrder')}
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Order;
