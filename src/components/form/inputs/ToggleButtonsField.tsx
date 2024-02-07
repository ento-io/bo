import {
  FormControl,
  FormHelperText,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  Typography,
  styled
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { ISelectOption } from '@/types/app.type';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    textTransform: 'capitalize',
    borderColor: '#BDBDBD',
    '&:first-of-type': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

type Props = {
  name: string;
  label?: string;
  helperText?: string;
  options: ISelectOption[];
  isMulti?: boolean;
} & ToggleButtonGroupProps;

const ToggleButtonsField = ({ name, label, helperText, isMulti, options, ...toggleButtonGroupProps }: Props) => {
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
          <StyledToggleButtonGroup
            {...toggleButtonGroupProps}
            value={value}
            onChange={(_, value: string[] | string) => onChange(value)}
            aria-label="text formatting"
            color="primary"
            exclusive={!isMulti}>
            {options.map((option, index: number) => (
              <StyledToggleButton value={option.value} aria-label={option.value} key={option.label + index}>
                <Typography>{option.label}</Typography>
              </StyledToggleButton>
            ))}
          </StyledToggleButtonGroup>
        )}
      />
      {errors[name] && <FormHelperText error>{(errors as any)[name].message}</FormHelperText>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ToggleButtonsField;
