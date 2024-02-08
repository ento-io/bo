import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
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
  const title = t('user:createAnAccount');

  const handleSubmitAccount = (values: ISignUpInput) => {
    dispatch(signUp(values, navigate));
  };

  return (
    <>
      <Head title={title} />
      <SignUpForm onSubmit={handleSubmitAccount} />
      <AuthLink label={t('user:alreadyHaveAccount')} text={t('user:login')} url={PATH_NAMES.login} />
    </>
  );
};

export default SignUp;
