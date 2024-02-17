import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { goToSendEmailResetPassword, verifyCodeSentByEmail } from '@/redux/actions/auth.action';

import CodeConfirmationForm from '@/containers/auth/CodeConfirmationForm';
import Head from '@/components/Head';

const ConfirmResetPasswordCodeSentByEmail = () => {
  const { t } = useTranslation(['user'])
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCodeInputChange = (code: string) => {
    dispatch(verifyCodeSentByEmail(code, navigate));
  };

  const handleResendCode = () => {
    navigate(goToSendEmailResetPassword());
  };

  return (
    <>
      <Head title={t('user:enterResetPasswordCode')} />
      <CodeConfirmationForm onResendCode={handleResendCode} onCodeChange={handleCodeInputChange} />
    </>
  )
};

export default ConfirmResetPasswordCodeSentByEmail;
