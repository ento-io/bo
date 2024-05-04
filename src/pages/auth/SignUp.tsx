import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import { Stack } from '@mui/material';
import Head from '@/components/Head';

import { signUp } from '@/redux/actions/auth.action';

import AuthLink from './AuthLink';
import { ISignUpInput } from '@/types/auth.type';
import SignUpForm from '@/containers/auth/SignUpForm';
import { PATH_NAMES } from '@/utils/pathnames';
import AuthPageLayout from './AuthPageLayout';
import { APP_NAME } from '@/utils/constants';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['user']);
  const title = t('user:signUp');

  const handleSubmitAccount = (values: ISignUpInput) => {
    dispatch(signUp(values, navigate));
  };

  return (
    <AuthPageLayout
      title={t('user:welcomeToTheApp', { app: APP_NAME })}
      description={t('user:accessToBO', { app: APP_NAME })}
      formTitle={t('user:createAnAdminAccount')}
      formDescription={t('user:anAdminAcceptsYourAccount')}
    >
      <Head title= { title } />
      <Stack spacing={2}>
        <SignUpForm onSubmit={handleSubmitAccount} />
        <AuthLink label={t('user:alreadyHaveAccount')} text={t('user:login')} url={PATH_NAMES.login} />
      </Stack>    
    </AuthPageLayout>
  );
};

export default SignUp;
