import { useEffect, useState } from 'react';

import { Button, Stack, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactInputVerificationCode from 'react-input-verification-code';
import { useSelector } from 'react-redux';


import { getAppErrorSelector } from '@/redux/reducers/app.reducer';

import { VERIFICATION_CODE_LENGTH } from '@/utils/constants';

import AuthLink from '../../pages/auth/AuthLink';
import { PATH_NAMES } from '@/utils/pathnames';

const classes = {
  verificationCodeContainer: (theme: Theme) => ({
    width: '100%',
    '& .ReactInputVerificationCode__container': {
      width: '100% !important',
    },
    '& .ReactInputVerificationCode__item': {
      color: '#fff',
      [theme.breakpoints.up('xl')]: {
        width: '60px !important',
        height: '60px !important',
      },
      [theme.breakpoints.between('lg', 'xl')]: {
        width: '70px !important',
        height: '70px !important',
      },
      [theme.breakpoints.between('sm', 'lg')]: {
        width: '50px !important',
        height: '50px !important',
      },
      [theme.breakpoints.down('sm')]: {
        width: '48px !important',
        height: '48px !important',
      },
    },
  }),
};

type Props = {
  onResendCode?: () => void;
  onCodeChange: (code: string) => void;
};
const CodeConfirmationForm = ({ onResendCode, onCodeChange }: Props) => {
  const { t } = useTranslation(['common', 'user']);
  const appError = useSelector(getAppErrorSelector);
  const resendCodeText = t('user:resendCode');

  const [code, setCode] = useState<string>('');

  useEffect(() => {
    // if an error occurred, clear the input
    if (!appError) return;
    setCode('');
  }, [appError]);

  const handleCodeInputChange = (code: string) => {
    if (code.length < VERIFICATION_CODE_LENGTH) return;
    onCodeChange(code);
    setCode(code);
  };

  const handleResendCode = () => {
    if (appError || !onResendCode) return;
    onResendCode();
  };

  return (
    <Stack>
      <Stack>
        {appError && (
          <Button color="inherit" size="small" onClick={handleResendCode}>
            {resendCodeText}
          </Button>
        )}
        <Stack spacing={3} alignItems="center">
          {/* --------- code input --------- */}
          <div css={classes.verificationCodeContainer}>
            <ReactInputVerificationCode
              autoFocus
              length={VERIFICATION_CODE_LENGTH}
              placeholder=""
              onChange={handleCodeInputChange}
              value={code} // optional, need this only for clearing the input
            />
          </div>
          {/* --------- links --------- */}
          <Stack spacing={2}>
            {onResendCode && (
              <AuthLink label={t('user:codeNotReceivedOrExpired')} text={resendCodeText} onClick={handleResendCode} />
            )}
            <AuthLink label={t('common:accountAlreadyVerified')} text={t('user:login')} url={PATH_NAMES.login} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CodeConfirmationForm;
