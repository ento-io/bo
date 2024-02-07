import { ReactNode, forwardRef } from 'react';

import { InputAdornment, Stack, Theme } from '@mui/material';
import { grey } from '@mui/material/colors';
import MUITextField, { TextFieldProps } from '@mui/material/TextField';

import { COLORS } from '@/utils/constants';

import InputLabel from '../InputLabel';

/**
 * add "*" to placeholder
 * @param placeholder
 * @param required
 * @returns
 */
const getPlaceholder = (placeholder?: string, required?: boolean): string => {
  if (!placeholder) return '';

  if (required) {
    return placeholder + ' *';
  }

  return placeholder;
};

const classes = {
  lightTextField: (theme: Theme) => ({
    '& .MuiInputLabel-root': {
      color: theme.palette.mode === 'dark' ? '#fff' : grey[900],
      fontSize: 18,
    },
    '& label.Mui-focused': {
      color: theme.palette.mode === 'dark' ? '#fff' : grey[900],
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: grey[900],
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: grey[400],
      },
      '&:hover fieldset': {
        borderColor: grey[700],
      },
      '&.Mui-focused fieldset': {
        borderColor: grey[900],
      },
    },
  }),
  darkTextField: (theme: Theme) => ({
    '& .MuiInputLabel-root': {
      color: '#fff',
      fontSize: 18,
    },
    '& label.Mui-focused': {
      color: '#fff',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'none',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: '1px solid rgba(225, 225, 255, 0.27)',
        fontSize: 15,
        borderRadius: 10,
        transition: 'all 0.125s ease 0s',
      },
      '& .MuiOutlinedInput-input': {
        color: '#fff',
        '&::placeholder': {
          color: COLORS.authTextFieldPlaceholder,
          opacity: 1,
        },
      },
      '&:hover fieldset': {
        border: '1px solid rgba(225, 225, 255, 0.4)',
        backgroundColor: 'rgba(185, 216, 233, 0.07)',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  }),
  rootWithIcons: (theme: Theme) => ({
    '& .MuiInputAdornment-root': {
      height: '100%',
      display: 'flex',
      justifyItems: 'center',
      alignItems: 'center',
    },
    '& .MuiInputAdornment-positionStart': {
      borderRight: '1px solid ' + theme.palette.grey[800],
      borderTopLeftRadius: theme.shape.borderRadius + 'px',
      borderBottomLeftRadius: theme.shape.borderRadius + 'px',
    },
  }),
};

export type CustomTextFieldInputProps = {
  bgcolor?: string;
  fixedLabel?: boolean;
  tooltip?: string;
  mode?: 'light' | 'dark';
  left?: ReactNode | string;
  right?: ReactNode;
  rightClassName?: string;
  leftClassName?: string;
  className?: string;
  shrinkLabel?: boolean;
  placeholder?: string;
} & TextFieldProps;

/**
 * should use `forwardRef` if using an refactored component with emotion
 * issue: https://stackoverflow.com/questions/66312566/how-to-type-forwardref-in-separate-select-component
 */
const TextFieldInput = forwardRef<HTMLDivElement, CustomTextFieldInputProps>(
  (
    {
      left,
      right,
      className,
      tooltip,
      fixedLabel,
      rightClassName,
      leftClassName,
      placeholder,
      shrinkLabel,
      bgcolor,
      mode = 'light',
      ...otherProps
    },
    ref,
  ) => {
    return (
      <Stack css={{ flex: otherProps.fullWidth ? 1 : 'initial' }}>
        {fixedLabel && <InputLabel label={otherProps.label} tooltip={tooltip} required={otherProps.required} />}
        <MUITextField
          ref={ref}
          {...otherProps}
          className={className}
          css={[
            mode === 'light' ? classes.lightTextField : classes.darkTextField,
            // bgcolor,
            (left || right) && classes.rootWithIcons,
            { backgroundColor: bgcolor },
          ]}
          InputLabelProps={{
            ...(shrinkLabel && { shrink: shrinkLabel }),
            ...otherProps.InputLabelProps,
          }}
          label={fixedLabel ? '' : otherProps.label}
          placeholder={getPlaceholder(placeholder, otherProps.required)}
          InputProps={{
            ...otherProps.InputProps,
            startAdornment: left ? (
              <InputAdornment position="start" className={leftClassName}>
                <div className="flex1 flexCenter">{left}</div>
              </InputAdornment>
            ) : null,
            endAdornment: right ? (
              <InputAdornment position="end" className={rightClassName}>
                <div className="flex1 flexCenter">{right}</div>
              </InputAdornment>
            ) : null,
          }}
        />
      </Stack>
    );
  },
);

export default TextFieldInput;
