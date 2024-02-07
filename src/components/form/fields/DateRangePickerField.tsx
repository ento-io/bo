import { ReactNode } from 'react';

import { FormControl, FormHelperText, FormLabel, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import DateRangeInput from '../inputs/DateRangePickerInput';

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  inputFormat?: string;
  separator?: string | ReactNode;
} & TextFieldProps;

const DateRangePickerField = ({ name, label, separator, inputFormat, helperText, ...textfieldProps }: Props) => {
  // hooks
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl component="fieldset" error={!!errors[name]}>
      {label && (
        <FormLabel component="legend" sx={{ mb: 1 }}>
          {label}
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DateRangeInput
            {...textfieldProps}
            onChange={onChange}
            value={value}
            separator={separator}
            inputFormat={inputFormat}
          />
        )}
      />
      {errors[name] && <FormHelperText error>{(errors as any)[name].message}</FormHelperText>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DateRangePickerField;
