import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Head from '@/components/Head';
import Dialog from '@/components/Dialog';
import AddFab from '@/components/AddFab';
import EstimateForm from './EstimateForm';
import { EstimateInput } from '@/types/estimate.type';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createEstimate, deleteEstimate, goToEstimates } from '@/redux/actions/estimate.action';
import { useNavigate } from '@tanstack/react-router';

const ESTIMATE_FORM_ID = 'estimate-form-id';

// eslint-disable-next-line react-hooks/rules-of-hooks

const Estimate = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const onSubmitHandler: SubmitHandler<EstimateInput> = values => {
    dispatch(createEstimate(values));
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

export default Estimate;
