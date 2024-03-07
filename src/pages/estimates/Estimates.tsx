import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Head from '@/components/Head';
import Dialog from '@/components/Dialog';
import AddFab from '@/components/AddFab';
import { createEstimate } from '@/redux/actions/estimate.action';

const Estimates = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const toggleDialog = () => setOpenFormDialog(!openFormDialog);

  const handleSave = () => {
    dispatch(createEstimate())
  }

  return (
    <div>
      <Head title={t('estimates')} />
      <h1>Estimates</h1>
      <AddFab onClick={toggleDialog} />
      <Dialog
        maxWidth="sm"
        fullWidth
        onPrimaryButtonAction={handleSave}
        primaryButtonText={t('save')}
        title={t('createEstimate')}
        open={openFormDialog}
        toggle={toggleDialog}>
        Form here
      </Dialog>
    </div>
  );
}

export default Estimates;
