import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Head from '@/components/Head';


import AuthLink from './AuthLink';
import LoginForm from '@/containers/auth/LoginForm';
import { PATH_NAMES } from '@/utils/pathnames';

const Login = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head title={t('user:login')} />
        <LoginForm />
        <Stack spacing={1}>
          <AuthLink label={t('user:haveNoAccountYet')} text={t('user:signUp')} url={PATH_NAMES.signUp} />
          {/* <AuthLink
            label={t('user:forgottenPassword')}
            text={t('user:resetPassword')}
            onClick={handleForgottenPassword}
          /> */}
        </Stack>
    </>
  );
};

export default Login;