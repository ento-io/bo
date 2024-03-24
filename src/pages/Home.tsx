import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation(['common', 'user']);

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const toggleDialog = () => setOpenFormDialog(!openFormDialog);

  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      <Stack spacing={1}>
        <Button onClick={toggleDialog} variant="contained" size="small">
          {t('createInvoice')}
        </Button>
      </Stack>
    </div>
  )
}

export default Home