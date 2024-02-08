import { FormControl, FormHelperText, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import InputLabel from '../InputLabel';
import DatePickerInput from '../inputs/DatePickerInput';

type Props = {
  name: string;
  label?: string;
  fixedLabel?: string;
  helperText?: string;
  inputFormat?: string;
  disableFuture?: boolean;
  withHour?: boolean;
  tooltip?: string;
} & TextFieldProps;

const DatePickerField = ({
  name,
  label,
  helperText,
  disableFuture,
  fixedLabel,
  inputFormat,
  tooltip,
  withHour = false,
  ...inputProps
}: Props) => {
  // hooks
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl component="fieldset" error={!!errors[name]}>
      {fixedLabel && <InputLabel label={fixedLabel} tooltip={tooltip} required={inputProps.required} />}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <DatePickerInput
            disableFuture={disableFuture}
            inputFormat={inputFormat}
            value={value}
            onChange={onChange}
            withHour={withHour}
            label={label}
            {...inputProps}
          />
        )}
      />
      {errors[name] && <FormHelperText error>{(errors as any)[name].message}</FormHelperText>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DatePickerField;
