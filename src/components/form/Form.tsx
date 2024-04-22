import { FormEvent, ReactNode, useMemo } from 'react';

import { Alert, Box, Button, Stack, useTheme } from '@mui/material';
import { ResponsiveStyleValue, SxProps, Theme } from '@mui/system';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useBreakpoint } from '@/hooks/useBreakpoint';

const classes = {
  buttons: (direction: 'row' | 'column') => (theme: Theme) => {
    if (direction === 'row') {
      return {
        [theme.breakpoints.up('md')]: {
          display: 'flex',
          flexDirection: 'row'as const,
          justifyContent: 'space-between' as const,
        },
      };
    }
    return {
      display: 'flex',
      flexDirection: 'column'as const,
    };
  },
  secondaryButton: (direction: 'row' | 'column') => (theme: Theme) => {
    if (direction === 'row') {
      return {
        [theme.breakpoints.up('md')]: {
          order: -1,
        },
      }
    }
    return {};
  }
}

export type IFormProps = {
  formId?: string;
  onSubmit?: (() => void) | ((event: FormEvent<HTMLFormElement>) => void);
  form?: any;
  loading?: boolean;
  buttonFullWidth?: boolean;
  children?: ReactNode;
  primaryButtonText?: string;
  error?: string;
  width?: string | number;
  sx?: SxProps<Theme>;
  buttonClassName?: string;
  direction?: ResponsiveStyleValue<'row' | 'row-reverse' | 'column' | 'column-reverse'>;
  isDisabled?: boolean;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
  secondaryButtonClassName?: string;
  buttonDirection?: 'row' | 'column';
};

const Form = ({
  formId,
  onSubmit,
  form,
  loading,
  children,
  primaryButtonText,
  onSecondaryButtonClick,
  secondaryButtonText,
  error,
  direction = 'column',
  width = '100%',
  sx,
  buttonClassName,
  secondaryButtonClassName,
  isDisabled = true,
  buttonFullWidth = true,
  buttonDirection = 'column',
  ...formProps
}: IFormProps) => {
  const theme = useTheme();
  const isSmallScreen = useBreakpoint();
  const { t } = useTranslation();

  const {
    formState: { isDirty, isValid },
    getFieldState,
  } = form;

  const isFullWidth = useMemo(() => {
    if (isSmallScreen) return true;
    if (buttonDirection === 'row') return false;
    return isSmallScreen || buttonFullWidth;
  }, [isSmallScreen, buttonFullWidth, buttonDirection]);

  const formComponent = (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
      id={formId}
      width={width}
      sx={sx}
      {...formProps}>
      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}
      <Stack direction={direction} spacing={2}>
        {children}
        {/* use the local id if no id is defined */}
        <div css={classes.buttons(buttonDirection)}>
          {!onSecondaryButtonClick && buttonDirection === 'row' && !isSmallScreen && <div />}
          {/* buttons */}
            {!formId && (
              <Button
                className={buttonClassName}
                variant="contained"
                fullWidth={isFullWidth}
                // fullWidth={direction === 'column'}
                disabled={isDisabled && (!isDirty || getFieldState().invalid || !isValid)}
                type="submit"
                // loading={loading}
                css={{
                  fontSize: 18,
                  fontWeight: 500,
                  py: direction === 'column' ? '0.7rem' : 0,
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.main,
                    opacity: 0.8,
                  },
                }}>
                {loading ? '...' : primaryButtonText ?? t('save')}
              </Button>
            )}
            {onSecondaryButtonClick && (
              <Button
                onClick={onSecondaryButtonClick}
                className={secondaryButtonClassName}
                fullWidth={isFullWidth}
                css={classes.secondaryButton(buttonDirection)}
              >
                {secondaryButtonText ?? t('cancel')}
              </Button>
            )}
        </div>
      </Stack>
    </Box>
  );

  if (!form) return formComponent;

  return <FormProvider {...form}>{formComponent}</FormProvider>;
};

export default Form;
