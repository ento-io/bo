import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, DialogProps, styled } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Dialog from '@/components/Dialog';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { ConfirmDeletionInput } from '@/types/app.type';
import { confirmDeletionSchema } from '@/validations/app.validations';

const StyledDescription = styled('span')({
  color: '#000',
});

const CONFIRM_DELETION_FORM_ID = 'confirm-deletion-form-id';

type Props = {
  value: string;
  onConfirmed: () => void;
  toggle: () => void;
  label: string;
  type: string;
  open?: boolean;
} & DialogProps;

const ConfirmDeletionFormModal = ({ value, onConfirmed, label, toggle, type, open = false, ...dialogProps }: Props) => {
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();
  // const { open: IsOpenConfirmDeleteModal, toggle: toggleOpenConfirmDeleteModal } = useToggle();

  const form = useForm<ConfirmDeletionInput>({
    resolver: zodResolver(confirmDeletionSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ConfirmDeletionInput> = async values => {
    if (values.confirmation !== value) {
      setError(t('infoMessages.pleaserEnterValue', { value }));
      return;
    }
    onConfirmed();
    toggle();
  };

  return (
    <Dialog
      primaryButtonText="delete"
      buttonColor="error"
      maxWidth="xs"
      fullWidth
      title={t('delete') + ' ' + label} // ex: Delete this order
      description={
        <StyledDescription>
          <span>
            {t('infoMessages.sureToDeleteThing')} <b>{label}?</b>
          </span>
          <br />
          <br />
          <span>
            {t('infoMessages.enterConfirmAndDelete', { type })} ({value})
          </span>
        </StyledDescription>
      }
      open={open}
      toggle={toggle}
      formId={CONFIRM_DELETION_FORM_ID}
      {...dialogProps}>
      <Box sx={{ mt: 3 }}>
        <Form formId={CONFIRM_DELETION_FORM_ID} form={form} onSubmit={handleSubmit(onSubmitHandler)}>
          <TextField
            autoFocus
            name="confirmation"
            placeholder={value}
            type="text"
            variant="outlined"
            required
            errorMessage={error}
          />
        </Form>
      </Box>
    </Dialog>
  );
};

export default ConfirmDeletionFormModal;
