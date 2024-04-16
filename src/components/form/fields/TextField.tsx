import { ChangeEvent } from 'react';

import { Stack, FormHelperText, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import TextFieldInput, { CustomTextFieldInputProps } from '../inputs/TextFieldInput';

type Props = {
  name: string;
  errorMessage?: string;
  transformValuePreview?: (value: string) => string;
  onFieldChange?: (value: string | number) => void;
  preview?: string;
} & CustomTextFieldInputProps;

const TextField = ({ name, errorMessage, onFieldChange, transformValuePreview, preview, ...inputProps }: Props) => {
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
          {transformValuePreview && (
            <Typography variant="caption" display="block" gutterBottom sx={{ pt: 0.5 }}>
              {preview}
              {transformValuePreview(field.value)}
            </Typography>
          )}
          {errors[name] && <FormHelperText error>{(errors as any)[name].message}</FormHelperText>}
        </Stack>
      )}
    />
  );
};

export default TextField;
