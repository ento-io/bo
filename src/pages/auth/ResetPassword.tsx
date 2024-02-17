import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Stack, Typography } from '@mui/material';
import PasswordField from '@/components/form/fields/PasswordField';
import Form from '@/components/form/Form';
import Head from '@/components/Head';

import { resetPassword } from '@/redux/actions/auth.action';
import { getAppAlertSelector, getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';

import { COLORS } from '@/utils/constants';

import { resetPasswordSchema } from '@/validations/auth.validation';
import { ResetPasswordInput } from '@/types/auth.types';
import AccountSuccessMessage from '@/containers/auth/AccountSuccessMessage';

const ResetPassword = () => {
  const { t } = useTranslation(['user']);
  const dispatch = useDispatch();
  const loading = useSelector(getUserLoadingSelector);
  const appError = useSelector(getAppErrorSelector);
  const alert = useSelector(getAppAlertSelector);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ResetPasswordInput> = async values => {
    dispatch(resetPassword(values));
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
        </Stack>
      <div>
        {alert?.severity === 'success'
          ? <AccountSuccessMessage />
          : (
            <Form
              form={form}
              onSubmit={handleSubmit(onSubmitHandler)}
              primaryButtonText={t('user:savePassword')}
              loading={loading}
              error={appError}
              isDisabled={false}
              buttonClassName="textCapitalize bR10">
              <PasswordField
                bgcolor={COLORS.authBackground}
                mode="dark"
                name="newPassword"
                placeholder={t('user:newPassword')}
                fullWidth
                required
              />
              <PasswordField
                bgcolor={COLORS.authBackground}
                mode="dark"
                name="newPasswordConfirmation"
                placeholder={t('user:confirmNewPassword')}
                fullWidth
                required
              />
            </Form>
          )
        }
      </div>
      </Stack>
    </>
  );
};

export default ResetPassword;
