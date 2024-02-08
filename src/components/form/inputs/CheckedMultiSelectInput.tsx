import { ReactNode, useEffect, useState } from 'react';

import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
} from '@mui/material';

import { ISelectOption } from '@/types/app.type';

const isAllSelected = (options: ISelectOption[], selected: any) =>
  options.length > 0 && selected.length === options.length;

type Props = {
  value?: any;
  label?: string;
  onChange: (values: any[]) => void;
  error?: string;
  autoWidth?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  options: ISelectOption[];
  bgcolor?: string;
};

const CheckedMultiSelectInput = ({
  value,
  onChange,
  options,
  sx,
  label,
  error,
  helperText,
  autoWidth,
  bgcolor = '#fff',
}: Props) => {
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    if (value && Array.isArray(value)) {
      setSelected(value);
    }
  }, [value]);

  /**
   * get only the value without the label
   */
  const formatValue = (inputValue: any) => {
    const selectedOptions: ISelectOption[] = options.filter((option: ISelectOption) =>
      inputValue?.includes(option.value),
    );
    const selectedValues = selectedOptions.map((option: ISelectOption) => option.value);
    return selectedValues;
  };

  /**
   * render value to label separated by ,
   */
  const renderValue = (selected: unknown): ReactNode => {
    if (!selected) return '';
    const values = [];
    for (const option of options) {
      if ((selected as any[]).includes(option.value)) {
        values.push(option.label);
      }
    }
    return values.join(', ');
  };

  const handleChange = (event: SelectChangeEvent<any>) => {
    const inputValue = event.target.value;
    if (inputValue[inputValue.length - 1] === 'all') {
      const allValues =
        inputValue.filter((v: any) => v !== 'all').length === options.length
          ? []
          : options.map((option: ISelectOption) => option.value);
      setSelected(allValues as any);
      onChange(allValues);
      return;
    }
    setSelected(inputValue);
    onChange(inputValue);
  };

  return (
    <FormControl sx={{ minWidth: 120 }}>
      {label && <InputLabel id="mutiple-select-label">{label}</InputLabel>}
      <Select
        autoWidth={autoWidth}
        labelId="mutiple-select-label"
        multiple
        value={formatValue(selected)}
        onChange={handleChange}
        renderValue={renderValue}
        sx={{ bgcolor, ...sx }}>
        <MenuItem value="all">
          <ListItemIcon>
            <Checkbox
              checked={isAllSelected(options, selected)}
              indeterminate={selected.length > 0 && selected.length < options.length}
            />
          </ListItemIcon>
          <ListItemText primary="Select All" />
        </MenuItem>
        {options.map((option: ISelectOption) => (
          <MenuItem key={option.value} value={option.value}>
            <ListItemIcon>
              <Checkbox checked={selected.indexOf(option?.value) > -1} />
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText error>{error}</FormHelperText>}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CheckedMultiSelectInput;
