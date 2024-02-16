import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';
import { SendEmailInput } from '@/types/user.type';
import { sendEmailSchema } from '@/validations/email.validation';

type Props = {
  formId: string;
  onSubmit: (input: SendEmailInput) => void;
};

const SendEmailForm = ({ formId, onSubmit }: Props) => {
  const { t } = useTranslation();
  const loading = useSelector(getUserLoadingSelector);
  const appError = useSelector(getAppErrorSelector);

  const form = useForm<SendEmailInput>({
    resolver: zodResolver(sendEmailSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<SendEmailInput> = async input => {
    onSubmit(input);
  };

  return (
    <Form formId={formId} form={form} onSubmit={handleSubmit(onSubmitHandler)} loading={loading} error={appError}>
      <TextField autoFocus name="subject" label={t('subject')} type="text" variant="standard" required />
      <TextField name="message" label={t('message')} type="text" variant="standard" multiline rows={4} required />
    </Form>
  );
};

export default SendEmailForm;
