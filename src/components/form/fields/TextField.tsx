import { ChangeEvent } from 'react';

import { Stack, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import TextFieldInput, { CustomTextFieldInputProps } from '../inputs/TextFieldInput';

type Props = {
  name: string;
  errorMessage?: string;
  onFieldChange?: (value: string | number) => void;
} & CustomTextFieldInputProps;

const TextField = ({ name, errorMessage, onFieldChange, ...inputProps }: Props) => {
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
          <TextFieldInput
            {...field}
            {...inputProps}
            error={!!errors[name] || !!errorMessage}
            onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              field.onChange(event.target.value);
              onFieldChange?.(event.target.value);
            }}
          />
          {errors[name] && <FormHelperText error>{(errors as any)[name].message}</FormHelperText>}
        </Stack>
      )}
    />
  );
};

export default TextField;
