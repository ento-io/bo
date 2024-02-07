import { Box, FormHelperText, InputLabel } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import RightsTableInput from '../inputs/RightsTableInput';

type Props = {
  name: string;
  label?: string;
  helperText?: string;
};

const RightsTableField = ({
  name,
  // options,
  label,
  helperText,
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
      render={({ field: { value, onChange } }) => (
        <Box>
          {label && <InputLabel sx={{ mb: 0.8, color: '#000' }}>{label}</InputLabel>}
          <RightsTableInput
            onChange={onChange}
            value={value}
            // options={options}
          />
          {errors[name] && <FormHelperText error>{(errors as any)[name]}</FormHelperText>}
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default RightsTableField;
