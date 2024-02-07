import { useEffect, useState } from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

type Props = {
  value?: Date;
  onChange: (value: any) => void;
  disableFuture?: boolean;
  withHour?: boolean;
  label?: string;
  inputFormat?: string;
} & TextFieldProps;

const DatePickerInput = ({
  value,
  disableFuture,
  onChange,
  label,
  inputFormat,
  withHour = false,
  ...inputProps
}: Props) => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!value) return;
    setDate(value);
  }, [value]);

  const handleChange = (newDate: Date) => {
    setDate(newDate);
    onChange(newDate);
  };

  let Component: any = DesktopDatePicker;

  if (withHour) {
    Component = DateTimePicker;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Component
        disableFuture={disableFuture}
        inputFormat={inputFormat ?? (withHour ? t('fullDateFormat') : t('dateOnlyFormat'))}
        value={date}
        onChange={(value: Date) => handleChange(dayjs(value).toDate())}
        label={label}
        renderInput={(params: TextFieldProps) => (
          <TextField variant="standard" margin="dense" fullWidth color="primary" {...params} {...inputProps} />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
