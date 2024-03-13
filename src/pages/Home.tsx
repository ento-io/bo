import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Dialog from "@/components/Dialog";

const Home = () => {
  const { t } = useTranslation(['common', 'user']);

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const toggleDialog = () => setOpenFormDialog(!openFormDialog);

  const handleSave = () => {

  }
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
        onPrimaryButtonAction={handleSave}
        primaryButtonText={t('save')}
        title={t('createInvoice')}
        open={openFormDialog}
        toggle={toggleDialog}>
        <p>form ...</p>
      </Dialog>
      <h2>{t('greeting', {  name: "Tiavina" })}</h2>
      <h2>{t('greeting', {  name: "Ben" })}</h2>
      <h2>{t('user:birthday')}</h2>
    </div>
  )
}

export default Home