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
      // update the list with the new checked selected option
      return prevState.map((option: IAdvancedSearchOption) => {
        if (option.name === name) {
          return { ...option, checked: event.target.checked };
        }
        return option;
      });
    });
  };

  return (
    <div css={{ paddingLeft: 6, paddingRight: 6 }}>
      <Stack spacing={1}>
        {options.map((option, index) => (
          <div key={option.name + index}>
            <FormControlLabel
              control={<Switch checked={option.checked}
              onChange={handleChangeOptions(option.name)} />}
              label={option.label}
              css={{ '& .MuiFormControlLabel-label': { fontSize: 14, marginLeft: 8 } }}
            />
            {option.checked && (
              <div css={{ marginBottom: 8, marginTop: 3 }}>
                {/* display the input when the checkbox is checked */}
                {option.component}
              </div>
            )}
          </div>
        ))}
      </Stack>
    </div>
  )
};

export default AdvancedSearchFields;