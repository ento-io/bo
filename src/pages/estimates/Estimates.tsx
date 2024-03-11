import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Head from '@/components/Head';
import Dialog from '@/components/Dialog';
import AddFab from '@/components/AddFab';
import { createEstimate } from '@/redux/actions/estimate.action';
import EstimateForm from './EstimateForm';
import { EstimateInput } from '@/types/estimate.type';

const ESTIMATE_FORM_ID = 'estimate-form-id';

const Estimates = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const toggleDialog = () => setOpenFormDialog(!openFormDialog);

  const handleSave = async (values: EstimateInput) => {
    dispatch(createEstimate(values));
  };

  return (
    <div>
      <Head title={t('estimates')} />
      <h1>Estimates</h1>
      <AddFab onClick={toggleDialog} />
      <Dialog
        maxWidth="sm"
        fullWidth
        primaryButtonText={t('save')}
        title={t('createEstimate')}
        open={openFormDialog}
        formId={ESTIMATE_FORM_ID}
        toggle={toggleDialog}
      >
        <EstimateForm
          formId={ESTIMATE_FORM_ID}
          onSubmit={handleSave}
        />
      </Dialog>
    </div>
  );
}

export default Estimates;
