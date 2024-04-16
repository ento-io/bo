import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PasswordField from '@/components/form/fields/PasswordField';
import Form from '@/components/form/Form';
import { changePasswordSchema } from '@/validations/auth.validation';
import { IChangePasswordInput } from '@/types/auth.type';

type Props = {
  formId: string;
  onSubmit: (values: IChangePasswordInput) => void;
};

const ProfileUserPasswordForm = ({ formId, onSubmit }: Props) => {
  const { t } = useTranslation();

  const form = useForm<IChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<IChangePasswordInput> = async values => {
    onSubmit(values);
  };

  return (
    <Form formId={formId} form={form} onSubmit={handleSubmit(onSubmitHandler)} primaryButtonText={t('user:login')}>
      <PasswordField name="currentPassword" label={t('user:currentPassword')} variant="standard" required />
      <PasswordField name="newPassword" label={t('user:newPassword')} variant="standard" required />
      <PasswordField name="newPasswordConfirmation" label={t('user:confirmNewPassword')} variant="standard" required />
    </Form>
  );
};

export default ProfileUserPasswordForm;
