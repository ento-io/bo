import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import PasswordField from '@/components/form/fields/PasswordField';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { login } from '@/redux/actions/auth.action';
import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';

import { ILoginInput } from '@/types/auth.type';
import { loginSchema } from '@/validations/auth.validation';

const LoginForm = () => {
  const { t } = useTranslation(['user']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(getUserLoadingSelector);
  const error = useSelector(getAppErrorSelector);

  const form = useForm<ILoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ILoginInput> = async values => {
    dispatch(login(values, navigate));
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit(onSubmitHandler)}
      loading={loading}
      primaryButtonText={t('user:login')}
      error={error}
      isDisabled={false}
      buttonClassName="textCapitalize bR10"
    >
      <TextField
        name="email"
        placeholder={t('user:enterYourEmail')}
        label={t('user:email')}
        fixedLabel
        type="email"
        fullWidth
      />
      <PasswordField
        name="password"
        label={t('user:password')}
        placeholder={t('user:yourPassword')}
        fixedLabel
        fullWidth
      />
  </Form>
  );
};

export default LoginForm;
