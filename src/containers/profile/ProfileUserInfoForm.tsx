import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { getAppCurrentUserSelector } from '@/redux/reducers/app.reducer';

import { ProfileUserInfoInput } from '@/types/user.type';
import { profileUserInfoSchema } from '@/validations/auth.validation';

type Props = {
  formId: string;
  onSubmit: (values: ProfileUserInfoInput) => void;
};

const ProfileUserInfoForm = ({ formId, onSubmit }: Props) => {
  const { t } = useTranslation();
  const { lastName, firstName } = useSelector(getAppCurrentUserSelector);

  const form = useForm<ProfileUserInfoInput>({
    resolver: zodResolver(profileUserInfoSchema),
    defaultValues: {
      lastName,
      firstName,
    },
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ProfileUserInfoInput> = async values => {
    onSubmit(values);
  };

  return (
    <Form formId={formId} form={form} onSubmit={handleSubmit(onSubmitHandler)}>
      <TextField autoFocus name="lastName" label={t('user:lastName')} type="text" variant="standard" required />
      <TextField name="firstName" label={t('user:firstName')} type="text" variant="standard" />
    </Form>
  );
};

export default ProfileUserInfoForm;
