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

type Props = {
  onSubmit: (values: ISignUpInput) => void;
  from?: 'signUp' | 'invitation'; // invitation from someone
  formId?: string;
};

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
          <TextField 
            name="url"
            placeholder={t('user:pasteUrlHere')}
            type="url"
            fullWidth
            required
                />
      </Dialog>
    </div>
  );
}

export default Estimates;
