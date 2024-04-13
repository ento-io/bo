import { Box, FormHelperText, Stack, SxProps, Theme } from '@mui/material';
import { DropzoneOptions } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';

import InputLabel from '../InputLabel';
import DropzoneInput from './input/DropzoneInput';

type Props = {
  name: string;
  label?: string;
  inputLabel?: string;
  helperText?: string;
  sx?: SxProps<Theme>;
  shouldReset?: boolean;
  tooltip?: string;
  type?: 'image' | 'csv' | 'json' | 'pdf';
  required?: boolean;
} & DropzoneOptions;

const DropzoneField = ({
  name,
  label,
  helperText,
  inputLabel,
  sx,
  shouldReset,
  required,
  tooltip,
  type = 'image',
  ...rest
}: Props) => {
  // hooks
  const {
    control,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  return (
    <Box sx={sx}>
      {/* ----------- label ----------- */}
      {label && <InputLabel label={label} required={required} tooltip={tooltip} sx={{ mb: 1, color: '#000' }} />}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, onBlur } }) => (
          <Stack>
            <DropzoneInput
              onChange={(...e) => {
                onChange(...e);

                // should trigger manually
                trigger(name);
              }}
              onBlur={onBlur}
              value={value}
              onError={(error: any) => {
                if (!error) {
                  clearErrors(name);
                  return;
                }
                setError(name, { type: 'custom', message: error });
              }}
              error={(errors as any)[name]}
              type={type}
              inputLabel={inputLabel}
              shouldReset={shouldReset}
              {...rest}
            />

            {/* ----------- errors ----------- */}
            {errors[name] && (
              <FormHelperText error sx={{ my: 1 }}>
                {(errors as any)[name]?.message}
              </FormHelperText>
            )}

            {/* ----------- helper text ----------- */}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </Stack>
        )}
      />
    </Box>
  );
};

export default DropzoneField;
