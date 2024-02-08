import { Box, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { isString } from '@/utils/utils';

import { ISelectOption } from '@/types/app.type';

import SelectInput from '../inputs/SelectInput';

type Props = {
  name: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: ISelectOption[];
  isMulti?: boolean;
  label?: string;
  helperText?: string;
  tooltip?: string;
  required?: boolean;
};

const SelectField = ({
  name,
  isDisabled,
  isLoading,
  isClearable,
  options,
  isSearchable,
  label,
  helperText,
  tooltip,
  required,
  isMulti = false,
}: Props) => {
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
            isDisabled={isDisabled}
            isLoading={isLoading}
            isClearable={isClearable}
            isSearchable={isSearchable}
            options={options}
            onBlur={onBlur}
            onChange={onChange}
            isMulti={isMulti}
            label={label}
            tooltip={tooltip}
            required={required}
          />
          {errors[name] && (
            <FormHelperText error>
              {isString((errors as any)[name]) ? (errors as any)[name] : (errors as any)[name].message}
            </FormHelperText>
          )}
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default SelectField;
