import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';
import Head from '@/components/Head';

import { goToResetPasswordConfirmCode, sendResetPasswordVerificationCode } from '@/redux/actions/auth.action';
import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';

import { COLORS } from '@/utils/constants';

import AuthLink from './AuthLink';
import { PATH_NAMES } from '@/utils/pathnames';
import { emailSchema } from '@/validations/auth.validation';
import { EmailInput } from '@/types/auth.type';

const SendEmailResetPassword = () => {
  const { t } = useTranslation(['user']);
  const dispatch = useDispatch();
  const loading = useSelector(getUserLoadingSelector);
  const appError = useSelector(getAppErrorSelector);
  const navigate = useNavigate();

  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<EmailInput> = async ({ email }) => {
    await dispatch(sendResetPasswordVerificationCode(email));
    navigate(goToResetPasswordConfirmCode())
  };

  return (
    <>
      <Head title={t('user:resetPassword')} />
      <Stack>
        {/* TODO: may make this reusable? */}
        <Stack>
          <Typography variant="h4" align="center" gutterBottom>
            {t('user:resetPassword')}
          </Typography>
          <Typography variant="body1" align="center">
            {t('user:sendEmailLinkToYou')}
          </Typography>
        </Stack>
        <Stack spacing={2}>
          {/* --------- form --------- */}
          <Form
            form={form}
            onSubmit={handleSubmit(onSubmitHandler)}
            primaryButtonText={t('user:sendCode')}
            loading={loading}
            error={appError}
            isDisabled={false}
            buttonClassName="textCapitalize bR10">
            <TextField
              bgcolor={COLORS.authBackground}
              mode="dark"
              name="email"
              placeholder={t('user:email')}
              type="email"
              fullWidth
              required
            />
          </Form>
          {/* --------- links --------- */}
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <AuthLink text={t('user:login')} url={PATH_NAMES.login} />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default SendEmailResetPassword;
