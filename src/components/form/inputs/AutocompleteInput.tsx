import { css } from '@emotion/css';
import { Theme } from '@emotion/react';
import {
  Autocomplete,
  AutocompleteProps as MUIAutocompleteProps,
  Paper,
  PaperProps,
  Popper,
  PopperProps,
  Stack,
} from '@mui/material';
import { ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react';

import TextFieldInput from './TextFieldInput';
import { ISelectOption } from '@/types/app.type';

const classes = {
  autocomplete: (theme: Theme) => ({
    '& .MuiFormControl-root': {
      padding: '0px !important',
      borderRadius: 6,
      '& label': {
        fontSize: 14,
        color: theme.palette.grey[600],
      },
      '& label.Mui-focused': {
        color: theme.palette.grey[800],
      },
    },
    '& .MuiInputBase-input': {
      fontSize: '14px !important',
      color: theme.palette.grey[800],
      '&::placeholder': {
        color: theme.palette.grey[300],
        fontSize: 14,
      },
    },
    '& fieldset': {
      fontSize: 14,
      color: theme.palette.grey[800],
      border: `1px solid ${theme.palette.grey[300]}`,
    },
    '&.Mui-focused fieldset': {
      fontSize: 14,
      border: `1px solid ${theme.palette.grey[300]}`,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${theme.palette.grey[300]}`,
      },
    },
  }),
  paper: (theme: Theme) => ({
    '& .MuiAutocomplete-listbox': {
      margin: '-8px 0',
      '& .MuiAutocomplete-option': {
        fontFamily: 'Product Sans Regular',
        fontSize: 14,
        padding: 16,
        borderTop: `1px solid ${theme.palette.grey[100]}`,
      },
    },
  }),
  popper: {
    // '& .MuiAutocomplete-noOptions': {
    //   display: 'none',
    // },
  },
  input: css({
    '& .MuiInputBase-root': {
      padding: 8,
    },
  }),
};

const AutocompletePaper = (props: PaperProps) => {
  return (
    <Paper elevation={0} css={classes.paper} variant="outlined" {...props} />
  );
};

const AutocompletePopper = (disableNoOptions: boolean) => (props: PopperProps) => {
  return (
    <Popper
      {...props}
      css={disableNoOptions && classes.popper}
      placement="bottom"
      disablePortal={disableNoOptions}
    />
  );
};

export type AutocompleteInputProps<T extends Record<string, any>> = {
  value: any;
  label?: string;
  options: any[];
  onChange: (value: any) => void;
  placeholder?: string;
  onChangeList?: (value: ISelectOption<T>[]) => void;
  loading?: boolean;
  withPreview?: boolean;
  left?: ReactNode | string;
  right?: ReactNode;
  renderPreviews?: (values: ISelectOption<T>[], handleDelete?: (id: string) => void) => ReactNode;
  onInputChange?: (value: any) => void;
  fullWidth?: boolean;
  inputClassName?: string;
  className?: string;
  disableNoOptions?: boolean;
} & Omit<MUIAutocompleteProps<any, any, any, any>, 'renderInput' | 'onChange' | 'onInputChange'>;

const AutocompleteInput = <T extends Record<string, any>>({
  value,
  label,
  onChange,
  placeholder,
  onChangeList,
  options = [],
  loading,
  withPreview,
  left,
  right,
  renderPreviews,
  onInputChange,
  fullWidth,
  inputClassName,
  className,
  disableNoOptions = true,
  ...props
}: AutocompleteInputProps<T>) => {
  const [values, setValues] = useState<ISelectOption<T>[]>([]);
  const [inputValue, setInputValue] = useState<string>(value);
  const [dynamicOptions, setDynamicOptions] = useState<ISelectOption<T>[]>([]);

  const originalOptions = useMemo(() => [...options], [options]);

  useEffect(() => {
    setDynamicOptions(options);
  }, [options]);

  const handleChange = (_: SyntheticEvent, value: ISelectOption<T>) => {
    if (withPreview) {
      const newValues = [value, ...values];
      setValues(newValues);
      onChangeList?.(newValues);
      onChange(value);

      const index = options.findIndex((option: ISelectOption<T>) => option.value === value.value);
      options.splice(index, 1);
      setDynamicOptions(options);

      return;
    }

    onChange(value);
  };

  const handleDelete = (id: string) => {
    const newValues = values.filter((value: ISelectOption<T>) => value.value.objectId !== id);
    setValues(newValues);
    onChangeList?.(newValues);

    // --------- update options --------- //
    const removedValue = values.find((value: ISelectOption<T>) => value.value.objectId === id);
    if (!removedValue) return;

    // add the removed value to options
    setDynamicOptions((prev: ISelectOption<T>[]): ISelectOption<T>[] => [removedValue, ...prev]);
  };

  const handleInputChange = (_: SyntheticEvent, value: string, reason?: string) => {
    if (reason === 'reset') {
      setInputValue('');
    }
    onInputChange?.(value);
  };

  return (
    <Stack spacing={1.6} className={fullWidth ? 'stretchSelf flex1' : ''}>
      <Stack direction="row">
        <Autocomplete
          loading={loading}
          sx={{ flex: 1 }}
          css={classes.autocomplete}
          className={className}
          value={value}
          inputValue={inputValue}
          onChange={handleChange}
          onInputChange={handleInputChange}
          options={withPreview ? dynamicOptions : originalOptions}
          getOptionLabel={option => {
            return option.label || '';
          }}
          isOptionEqualToValue={(_: ISelectOption<T>, value: ISelectOption<T>) => {
            const currentOptions = withPreview ? dynamicOptions : originalOptions;
            return currentOptions.find((option: ISelectOption<T>) => option.value.objectId === value.value?.objectId);
          }}
          selectOnFocus
          blurOnSelect // https://github.com/mui/material-ui/issues/21019
          clearOnBlur
          handleHomeEndKeys
          disableClearable
          PaperComponent={AutocompletePaper}
          renderInput={params => (
            <TextFieldInput
              {...params}
              placeholder={placeholder}
              label={label}
              left={left}
              right={right}
              className={classes.input}
            />
          )}
          PopperComponent={AutocompletePopper(disableNoOptions)}
          {...props}
        />
      </Stack>

      {withPreview && values.length > 0 && renderPreviews?.(values, handleDelete)}
    </Stack>
  );
};

export default AutocompleteInput;
