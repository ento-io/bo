import { MouseEvent, forwardRef } from 'react';

import { IconButton } from '@mui/material';

import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useToggle } from '@/hooks/useToggle';

import { COLORS } from '@/utils/constants';

import TextFieldInput, { CustomTextFieldInputProps } from './TextFieldInput';

const PasswordInput =  forwardRef<HTMLDivElement, CustomTextFieldInputProps>(({ ...otherProps }, ref) => {
  const { open: showPassword, toggle: toggleShowPassword } = useToggle();

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextFieldInput
      ref={ref}
      {...otherProps}
      type={showPassword ? 'text' : 'password'}
      right={
        <IconButton
          aria-label="toggle password visibility"
          onClick={toggleShowPassword}
          onMouseDown={handleMouseDownPassword}
          css={{ color: otherProps.mode === 'light' ? '#000' : COLORS.authTextFieldPlaceholder }}
          edge="end">
          {/* toggle eye icon */}
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </IconButton>
      }
    />
  );
});

export default PasswordInput;
