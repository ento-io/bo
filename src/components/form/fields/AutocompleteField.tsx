import { FormControl, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import AutocompleteInput, { AutocompleteInputProps } from '../inputs/AutocompleteInput';
import { ISelectOption } from '@/types/app.type';

type Props<T extends Record<string, any>> = {
  name: string;
  label?: string;
  previewName: string;
  fullWidth?: boolean;
  helperText?: string;
  withPreviewCard?: boolean;
} & Omit<AutocompleteInputProps<T>, 'name' | 'onChange' | 'value'>;

const AutocompleteField = <T extends Record<string, any>>({ name, label, fullWidth, helperText, previewName, ...otherProps }: Props<T>) => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <FormControl component="fieldset" error={!!errors?.[name]} fullWidth={fullWidth}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { value, onChange } }) => (
          <AutocompleteInput<T>
            {...otherProps}
            value={value}
            onChange={onChange}
            label={label}
            // onChange function only is validated by default
            onChangeList={(values: ISelectOption<T>[]) => {
              setValue(previewName, values, { shouldValidate: true });
            }}
          />
        )}
      />
      {errors[name] ? (
        <FormHelperText error>{(errors as any)[name].message}</FormHelperText>
      ) : (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default AutocompleteField;
