import { useSelector , useDispatch } from 'react-redux';


import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { verifyAccountEmail } from '@/redux/actions/auth.action';
import { getAppAlertSelector } from '@/redux/reducers/app.reducer';

import Head from '@/components/Head';
import CodeConfirmationForm from '@/containers/auth/CodeConfirmationForm';
import AccountSuccessMessage from '@/containers/auth/AccountSuccessMessage';

const ConfirmAccount = () => {
  const { t } = useTranslation(['common', 'user']);

  const alert = useSelector(getAppAlertSelector);
  const dispatch = useDispatch();

  const handleCodeInputChange = async (code: string) => {
    dispatch(verifyAccountEmail(code));
  };

  return (
    <>
      <Head title={t('user:accountConfirmation')} description={t('user:emailWithCodeSentConfirmCodeBelow')} />
      <Stack>
        <Stack>
          <Typography variant="h4" align="center" gutterBottom>
            {t('user:accountConfirmation')}
          </Typography>
          <Typography variant="body1" align="center">
            {t('user:emailWithCodeSentConfirmCodeBelow')}
          </Typography>
        </Stack>
        {alert?.type === 'accountVerification' && alert.severity === 'success'
          ? <AccountSuccessMessage />
          : <CodeConfirmationForm onCodeChange={handleCodeInputChange} />
        }
      </Stack>

    </>
  )
};

export default ConfirmAccount;
