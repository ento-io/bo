import { Stack, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import PasswordInput from '../inputs/PasswordInput';
import { CustomTextFieldInputProps } from '../inputs/TextFieldInput';

type Props = {
  name: string;
  errorMessage?: string;
} & CustomTextFieldInputProps;

const PasswordField = ({ name, errorMessage, ...inputProps }: Props) => {
  // hooks
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={({ field }) => (
        <Stack>
          <PasswordInput {...field} {...inputProps} variant="outlined" error={!!errors[name] || !!errorMessage} />
          {errors[name] && <FormHelperText error>{(errors as any)[name].message}</FormHelperText>}
        </Stack>
      )}
    />
  );
};

export default PasswordField;
