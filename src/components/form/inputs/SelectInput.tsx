import { Stack, Theme, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import { ISelectOption } from '@/types/app.type';

import InputLabel from '../InputLabel';

type CustomStyleProps = {
  menu?: Record<string, any>;
  option?: Record<string, any>;
  control?: Record<string, any>;
  singleValue?: Record<string, any>;
  multiValue?: Record<string, any>;
};
const getCustomStyles = (theme: Theme, width: number | string = '100%', styleProps?: CustomStyleProps) => ({
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.default,
    color: theme.palette.mode === 'light' ? 'none' : '#fff',
    zIndex: 9999,
    ...styleProps?.menu,
  }),
  option: (styles: any, state: any) => ({
    ...styles,
    color: state.isSelected ? theme.palette.primary.main : 'initial',

    backgroundColor: theme.palette.mode === 'light' ? 'none' : theme.palette.background.default,
    ...styleProps?.option,
  }),
  menuPortal: (styles: any) => ({ ...styles, zIndex: 5 }),
  control: (styles: any) => ({
    ...styles,
    borderBottom: theme.palette.mode === 'light' ? '1px solid grey' : 'none',
    border: theme.palette.mode === 'light' ? '1px solid ' + grey[400] : '1px solid #fff',
    borderRadius: 4,
    paddingTop: 9,
    paddingBottom: 9,
    backgroundColor: theme.palette.mode === 'light' ? 'none' : theme.palette.background.default,
    width,
    ...styleProps?.control,
  }),
  singleValue: (styles: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return {
      ...styles,
      opacity,
      transition,
      borderRadius: 4,
      color: theme.palette.mode === 'light' ? 'none' : '#fff',
      ...styleProps?.singleValue,
    };
  },
  multiValue: (styles: any) => ({
    ...styles,
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.mode === 'light' ? 'none' : '#fff',
    border: theme.palette.mode === 'light' ? '1px solid ' + grey[500] : '1px solid rgba(255, 255, 255, 0.2)',
    ...styleProps?.multiValue,
  }),
  multiValueLabel: (styles: any) => ({
    ...styles,
    color: theme.palette.mode === 'light' ? 'none' : '#fff',
  }),
});

type ICustomSelectOption = ISelectOption<string | number>;

type Props = {
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: ICustomSelectOption[];
  isMulti?: boolean;
  label?: string;
  width?: number | string;
  tooltip?: string;
  placeholder?: string;
  required?: boolean;
  onBlur?: () => void;
  value: any;
  onChange: (values: Record<string, any> | Record<string, any>[] | string | number) => void;
  direction?: 'row' | 'column';
  styles?: Record<string, any>;
};

const SelectInput = ({
  value,
  isDisabled,
  isLoading,
  isClearable,
  options,
  isSearchable,
  label,
  tooltip,
  required,
  onBlur,
  onChange,
  placeholder,
  styles,
  direction = 'column',
  width = '100%',
  isMulti = false,
}: Props) => {
  const muiTheme = useTheme();
  const { t } = useTranslation();

  /**
   * get only the value without the label
   * @param value
   * @returns
   */
  const formatValue = (value: any) => {
    if (isMulti) {
      const selectedOptions = options.filter((option: ICustomSelectOption) => value?.includes(option.value));
      return selectedOptions;
    }
    const selectedOption = options.find((option: ICustomSelectOption) => option.value === value);
    return selectedOption;
  };

  return (
    <Stack direction={direction}>
      {label && <InputLabel label={label} tooltip={tooltip} required={required} sx={{ color: '#000' }} />}
      <Select
        styles={getCustomStyles(muiTheme, width, styles)}
        menuPosition="fixed"
        value={formatValue(value)}
        classNamePrefix="select"
        defaultValue={formatValue(value)}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        options={options}
        onBlur={onBlur}
        theme={(theme: any) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary: muiTheme.palette.primary.main,
          },
        })}
        onChange={(inputValue: any) => {
          if (!inputValue) return;

          // get only the value, not the label
          if (isMulti) {
            const values = (inputValue as any)?.map((option: ICustomSelectOption) => option.value);
            onChange(values);
            return;
          }

          onChange((inputValue as any)?.value);
        }}
        isMulti={isMulti}
        placeholder={placeholder ?? `${t('select')}...`}
      />
    </Stack>
  );
};

export default SelectInput;
