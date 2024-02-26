import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useNavigate } from '@tanstack/react-router';
import Head from '@/components/Head';


import AuthLink from './AuthLink';
import LoginForm from '@/containers/auth/LoginForm';
import { PATH_NAMES } from '@/utils/pathnames';
import { goToSendEmailResetPassword } from '@/redux/actions/auth.action';
import Logo from '@/components/Logo';
import AuthTitle from '@/components/Title';
import Title from '@/components/Title';

const Login = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleForgottenPassword = () => {
    navigate(goToSendEmailResetPassword());
  };

  return (
    <>
      <Head title={t('user:login')} />
      <Stack spacing={2}>
          <div className='flexCenter'>
            <div css={{ paddingBottom: 10}}>
            <Logo />
            </div>
            <Typography variant="h3" gutterBottom>
              {t('user:login')}
            </Typography>
          </div>
          <LoginForm />
          <Stack spacing={1}>
            <AuthLink label={t('user:haveNoAccountYet')} text={t('user:signUp')} url={PATH_NAMES.signUp} />
            <AuthLink
              label={t('user:forgottenPassword')}
              text={t('user:resetPassword')}
              onClick={handleForgottenPassword}
            />
          </Stack>        
      </Stack>
    </>
  );
};

export default Login;
