import { css } from '@emotion/css';
import { Theme } from '@emotion/react';
import {
  Autocomplete,
  Card,
  IconButton,
  AutocompleteProps as MUIAutocompleteProps,
  Paper,
  PaperProps,
  Popper,
  PopperProps,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react';

import { FiX } from 'react-icons/fi';
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
    '& .MuiAutocomplete-option': {
      backgroundColor: '#000 !important',
      color: 'blue'
    },
    '& .Mui-focused': {
      backgroundColor: theme.palette.grey[50],
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
  input: css({
    '& .MuiInputBase-root': {
      padding: 8,
    },
  }),
};

const AutocompletePaper = (props: PaperProps) => {
  return (
    <Paper elevation={0} variant="outlined" {...props} />
  );
};

const AutocompletePopper = (disableNoOptions: boolean) => (props: PopperProps) => {
  return (
    <Popper
      {...props}
      css={{
        '& .MuiAutocomplete-noOptions': {
          display: disableNoOptions ? 'none' : 'block',
        },
      }}
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
  multiple?: boolean;
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
  multiple = false,
  disableNoOptions = true,
  ...props
}: AutocompleteInputProps<T>) => {

  const [singleSelectionSelectedValues, setSingleSelectionSelectedValues] = useState<ISelectOption<T>[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState<ISelectOption<T>[]>([]);

  const originalOptions = useMemo(() => [...options], [options]);

  useEffect(() => {
    setDynamicOptions(options);
  }, [options]);

  // when selecting an option
  const handleChange = (_: SyntheticEvent, value: ISelectOption<T>) => {
    if (withPreview) {
      const newValues = [value, ...singleSelectionSelectedValues];
      setSingleSelectionSelectedValues(newValues);
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
    const newValues = singleSelectionSelectedValues.filter((value: ISelectOption<T>) => value.value.objectId !== id);
    setSingleSelectionSelectedValues(newValues);
    onChangeList?.(newValues);

    // --------- update options --------- //
    const removedValue = singleSelectionSelectedValues.find((value: ISelectOption<T>) => value.value.objectId === id);
    if (!removedValue) return;

    // add the removed value to options
    setDynamicOptions((prev: ISelectOption<T>[]): ISelectOption<T>[] => [removedValue, ...prev]);
  };

  const handleMultipleDelete = (id: string) => {
    const newValues = value.filter((value: ISelectOption<T>) => value.value.objectId !== id);
    onChange(newValues);
  };

  // when taping
  const handleInputChange = (_: SyntheticEvent, value: string, reason?: string) => {
    if (!onInputChange) return;
    if (reason === 'reset') {
      onInputChange('');
      return;
    }
    onInputChange(value);
  };

  return (
    <Stack spacing={1.6} className={fullWidth ? 'stretchSelf flex1' : ''}>
      <Stack direction="row">
        <Autocomplete
          multiple={multiple}
          loading={loading}
          sx={{ flex: 1 }}
          css={classes.autocomplete}
          className={className}
          value={value}
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
          disablePortal
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
          slotProps={{
            popper: {
              sx: {
                zIndex: 1000,
              }
            }
          }}
          {...props}
        />
      </Stack>

      {/* preview selected values in single select */}
      {withPreview && singleSelectionSelectedValues.length > 0 && renderPreviews?.(singleSelectionSelectedValues, handleDelete)}

      {/* preview selected when multi select */}
      {multiple && value.length > 0 && (
        <Stack spacing={1} direction="row">
          {value.map((value: ISelectOption<T>) => (
            <Card key={value.value.objectId} className="flexRow center" css={{ padding: 4, paddingLeft: 12 }}>
              <Typography>{value.label}</Typography>
              <IconButton onClick={() => handleMultipleDelete(value.value.objectId)} css={{ marginLeft: 4 }}>
                <FiX size={16} />
              </IconButton>
            </Card>
          ))}
          </Stack>
      )}

    </Stack>
  );
};

export default AutocompleteInput;
