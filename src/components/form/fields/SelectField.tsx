import { Box, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { isString } from '@/utils/utils';

import { ISelectOption } from '@/types/app.type';

import SelectInput, { ReactSelectProps } from '../inputs/SelectInput';

export type SelectProps = {
  name: string;
  options: ISelectOption[];
  helperText?: string;
} & Omit<ReactSelectProps, 'value' | 'onChange'>;

const SelectField = ({
  name,
  options,
  helperText,
  ...selectProps
}: SelectProps) => {
  // hooks
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <Box>
          <SelectInput
            value={value}
            options={options}
            onBlur={onBlur}
            onChange={onChange}
            {...selectProps}
          />
          {errors[name] && (
            <FormHelperText error>
              {isString((errors as any)[name]) ? (errors as any)[name] : (errors as any)[name].message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default SelectField;
