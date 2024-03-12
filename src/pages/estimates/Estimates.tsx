import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Head from '@/components/Head';
import Dialog from '@/components/Dialog';
import AddFab from '@/components/AddFab';
import EstimateForm from './EstimateForm';
import { EstimateInput } from '@/types/estimate.type';
import { createEstimate } from '@/actions/estimate.action';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createEstimateAction } from '@/redux/actions/estimate.action';

const ESTIMATE_FORM_ID = 'estimate-form-id';

const Estimates = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();


  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const handleSubmitEstimate = async (values: EstimateInput) => {
      await createEstimate(values);
  }

  const onSubmitHandler: SubmitHandler<EstimateInput> = async values => {
    await handleSubmitEstimate(values);
    dispatch(createEstimateAction(values));
  };

  const toggleDialog = () => setOpenFormDialog(!openFormDialog);

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
          onSubmit={onSubmitHandler}
        />
      </Dialog>
    </div>
  );
}

export default Estimates;
