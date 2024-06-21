import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import PasswordField from '@/components/form/fields/PasswordField';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';

import { ISignUpInput } from '@/types/auth.type';
import { signUpSchema } from '@/validations/auth.validation';

type Props = {
  onSubmit: (values: ISignUpInput) => void;
  from?: 'signUp' | 'invitation'; // invitation from someone
  formId?: string;
};
const SignUpForm = ({ onSubmit, formId, from = 'signUp' }: Props) => {
  const loading = useSelector(getUserLoadingSelector);
  const error = useSelector(getAppErrorSelector);
  const { t } = useTranslation(['user']);

  const button = from === 'signUp' ? t('user:createAnAccount') : '';

  const form = useForm<ISignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ISignUpInput> = async values => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      formId={formId}
      onSubmit={handleSubmit(onSubmitHandler)}
      loading={loading}
      error={error}
      buttonClassName="textCapitalize bR10"
      isDisabled={false}
      primaryButtonText={button}
    >
      <TextField
        name="email"
        placeholder={t('user:email')}
        type="email"
        fullWidth
      />
      <TextField name="firstName" placeholder={t('user:firstName')} fullWidth />
      <TextField name="lastName" placeholder={t('user:lastName')} fullWidth />
      <PasswordField name="password" placeholder={t('user:password')} fullWidth />
      <PasswordField
        name="passwordConfirmation"
        placeholder="Confirm password"
        fullWidth
      />
    </Form>
  );
};

export default SignUpForm;
