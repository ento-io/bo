import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import PasswordField from '@/components/form/fields/PasswordField';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';

import { COLORS } from '@/utils/constants';
import { ISignUpInput } from '@/types/auth.types';
import { signUpSchema } from '@/validations/auth.validation';
import { Typography } from '@mui/material';
import Logo from '@/components/Logo';


type Props = {
  onSubmit: (values: ISignUpInput) => void;
  from?: 'signUp' | 'invitation'; // invitation from someone
  formId?: string;
};
const SignUpForm = ({ onSubmit, formId, from = 'signUp' }: Props) => {
  const loading = useSelector(getUserLoadingSelector);
  const error = useSelector(getAppErrorSelector);
  const { t } = useTranslation(['user']);

  const color = from === 'signUp' ? COLORS.authBackground : '';
  const button = from === 'signUp' ? t('user:createAnAccount') : '';
  const mode = from === 'signUp' ? 'dark' : 'light';

  const form = useForm<ISignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ISignUpInput> = async values => {
    onSubmit(values);
  };

  return (
    <div className='flexCenter'>
      <div css={{ paddingBottom: 20 }}>
        <Logo />
      </div>
      <div>
        <Typography variant="h3" gutterBottom >
          {t('user:signUp')}
        </Typography>
      </div>
      <div className="stretchSelf">
      <Form
          form={form}
          formId={formId}
          onSubmit={handleSubmit(onSubmitHandler)}
          loading={loading}
          error={error}
          buttonClassName="textCapitalize bR10"
          isDisabled={false}
          primaryButtonText={button}>
          <TextField
            bgcolor={color}
            mode={mode}
            name="email"
            placeholder={t('user:email')}
            type="email"
            fullWidth
            required
          />
          <TextField bgcolor={color} mode={mode} name="firstName" placeholder={t('user:firstName')} fullWidth />
          <TextField bgcolor={color} mode={mode} name="lastName" placeholder={t('user:lastName')} fullWidth required />
          <PasswordField bgcolor={color} mode={mode} name="password" placeholder={t('user:password')} fullWidth required />
          <PasswordField
            bgcolor={color}
            mode={mode}
            name="passwordConfirmation"
            placeholder="Confirm password"
            fullWidth
            required
        />
    </Form>
      </div> 
    </div>
    
  );
};

export default SignUpForm;
