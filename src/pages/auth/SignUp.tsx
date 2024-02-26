import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import { Stack, Typography } from '@mui/material';
import Head from '@/components/Head';

import { signUp } from '@/redux/actions/auth.action';

import AuthLink from './AuthLink';
import { ISignUpInput } from '@/types/auth.types';
import SignUpForm from '@/containers/auth/SignUpForm';
import { PATH_NAMES } from '@/utils/pathnames';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['user']);
  const title = t('user:signUp');

  const handleSubmitAccount = (values: ISignUpInput) => {
    dispatch(signUp(values, navigate));
  };

  return (
    <>
      <Head title= { title } />
      <Stack spacing={2}>
      <div className='flexCenter'>
        <Typography variant="h4" gutterBottom>
          {t('user:signUp')}
        </Typography>
      </div>
      <Stack spacing={2}>
        <SignUpForm onSubmit={handleSubmitAccount} />
            <AuthLink label={t('user:alreadyHaveAccount')} text={t('user:login')} url={PATH_NAMES.login} />
        </Stack>    
      </Stack>
    </>
  );
};

export default SignUp;
