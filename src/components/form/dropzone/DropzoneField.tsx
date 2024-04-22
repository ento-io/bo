import { Box, FormHelperText, Stack, SxProps, Theme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import InputLabel from '../InputLabel';
import DropzoneInput, { CustomDropzoneInputProps } from './input/DropzoneInput';

type Props = {
  name: string;
  label?: string;
  inputLabel?: string;
  sx?: SxProps<Theme>;
  shouldReset?: boolean;
  tooltip?: string;
  type?: 'image' | 'csv' | 'json' | 'pdf';
  required?: boolean;
  error?: string;
  onFieldChange?: () => void;
} & Omit<CustomDropzoneInputProps, 'error'| 'onChange' | 'onBlur' | 'onError'>;

const DropzoneField = ({
  name,
  label,
  inputLabel,
  sx,
  shouldReset,
  required,
  tooltip,
  onFieldChange,
  error,
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
                onFieldChange?.();

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
              error={error || (errors as any)[name]}
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
          </Stack>
        )}
      />
    </Box>
  );
};

export default DropzoneField;
