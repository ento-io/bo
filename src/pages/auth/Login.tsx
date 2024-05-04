import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useNavigate } from '@tanstack/react-router';
import Head from '@/components/Head';


import AuthLink from './AuthLink';
import LoginForm from '@/containers/auth/LoginForm';
import { PATH_NAMES } from '@/utils/pathnames';
import { goToSendEmailResetPassword } from '@/redux/actions/auth.action';
import AuthPageLayout from './AuthPageLayout';
import { APP_NAME } from '@/utils/constants';

const Login = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleForgottenPassword = () => {
    navigate(goToSendEmailResetPassword());
  };

  return (
    <AuthPageLayout
      title={t('user:welcomeToTheApp', { app: APP_NAME })}
      description={t('user:accessToBO', { app: APP_NAME })}
      formTitle={t('user:loginToApp', { app: APP_NAME })}
    >
      <Head title={t('user:login')} />
      <Stack spacing={2}>
          <LoginForm />
          <Stack spacing={2}>
            <AuthLink label={t('user:haveNoAccountYet')} text={t('user:signUp')} url={PATH_NAMES.signUp} />
            <AuthLink
              label={t('user:forgottenPassword')}
              text={t('user:resetPassword')}
              onClick={handleForgottenPassword}
            />
          </Stack>        
      </Stack>
    </AuthPageLayout>
  );
};

export default Login;
