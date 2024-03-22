import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { SubmitHandler } from "react-hook-form";

import Dialog from "@/components/Dialog";
import InvoiceForm from "./invoices/InvoiceForm";
import { InvoiceInput } from "@/types/invoice.type";
import { createInvoice } from "@/redux/actions/invoice.action";

const INVOICE_FORM_ID = 'invoce-form-id';

const Home = () => {
  const { t } = useTranslation(['common', 'user']);

  const dispatch = useDispatch();

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const toggleDialog = () => setOpenFormDialog(!openFormDialog);

  const onSubmitHandler: SubmitHandler<InvoiceInput> = values => {
    dispatch(createInvoice(values));
  };
  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      <Stack spacing={1}>
        <Button onClick={toggleDialog} variant="contained" size="small">
          {t('createInvoice')}
        </Button>
      </Stack>
      <Dialog
        maxWidth="sm"
        fullWidth
        primaryButtonText={t('route:create')}
        title={t('createInvoice')}
        open={openFormDialog}
        formId={INVOICE_FORM_ID}
        toggle={toggleDialog}
      >
        <InvoiceForm
          formId={INVOICE_FORM_ID}
          onSubmit={onSubmitHandler}
        />
      </Dialog>
      <h2>{t('greeting', {  name: "Tiavina" })}</h2>
      <h2>{t('greeting', {  name: "Ben" })}</h2>
      <h2>{t('user:birthday')}</h2>
    </div>
  )
}

export default Home