import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Head from '@/components/Head';
import Dialog from '@/components/Dialog';
import AddFab from '@/components/AddFab';
import { createEstimate } from '@/redux/actions/estimate.action';
// import TextField from '@/components/form/fields/TextField';
import { useNavigate } from '@tanstack/react-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import EstimateForm from '@/containers/estimate/EstimateForm';
import { IEstimateInput } from '@/types/estimate.types';


const Estimates = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const ESTIMATE_FORM_ID = 'estimate-form-id';

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const toggleDialog = () => setOpenFormDialog((prev: boolean): boolean => !prev);

 
  const onSubmitHandler: SubmitHandler<IEstimateInput> = async () => {
   await dispatch(createEstimate());
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
        toggle={toggleDialog}
        formId={ESTIMATE_FORM_ID}
        >
          <EstimateForm 
            formId={ESTIMATE_FORM_ID}
            onSubmit={()=> onSubmitHandler} 
          />
      </Dialog>
    </div>
  );
}

export default Estimates;
