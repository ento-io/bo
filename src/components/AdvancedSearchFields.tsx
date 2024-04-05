import { ChangeEvent, useEffect, useState } from 'react';
import { FormControlLabel, Stack, Switch } from '@mui/material';
import { IAdvancedSearchOption } from '@/types/app.type';

type Props = {
  fields?: IAdvancedSearchOption[];
};

const AdvancedSearchFields = ({ fields = [] }: Props) => {
  const [options, setOptions] = useState<IAdvancedSearchOption[]>([]);

  useEffect(() => {
    setOptions(fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeOptions = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setOptions((prevState: IAdvancedSearchOption[]) => {
      return prevState.map((option: IAdvancedSearchOption) => {
        if (option.name === name) {
          return { ...option, checked: event.target.checked };
        }
        return option;
      });
    });
  };

  return (
    <Stack spacing={0}>
      {options.map((option, index) => (
        <div key={option.name + index}>
          <FormControlLabel
            control={<Switch checked={option.checked}
            onChange={handleChangeOptions(option.name)} />}
            label={option.label}
          />
          {/* display the input when the checkbox is checked */}
          {option.checked && option.component}
        </div>
      ))}
  </Stack>
  )
};

export default AdvancedSearchFields;