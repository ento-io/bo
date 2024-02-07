import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

import { ISelectOption } from '@/types/app.type';

type Props = {
  name: string;
  label?: string;
  options: ISelectOption[];
};

const CheckboxesField = ({ name, label, options }: Props) => {
  // hooks
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormControl component="fieldset" error={!!errors?.[name]}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup row>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          render={({ field }: any): any =>
            options.map((option: ISelectOption, index: number) => (
              <FormControlLabel
                {...field}
                key={option.label + index}
                label={option.label}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => {
                      if (!field.value?.includes(option.value)) {
                        field.onChange([...field.value, option.value]);
                        return;
                      }
                      const newOptions = field.value.filter((value: any) => value !== option.value);
                      field.onChange(newOptions);
                    }}
                  />
                }
              />
            ))
          }
        />
      </FormGroup>
      <FormHelperText>{(errors as any)[name]?.message}</FormHelperText>
    </FormControl>
  );
};

export default CheckboxesField;
