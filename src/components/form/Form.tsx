import { FormEvent, ReactNode } from 'react';

import { Alert, Box, Button, Stack, useTheme } from '@mui/material';
import { ResponsiveStyleValue, SxProps, Theme } from '@mui/system';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useBreakpoint } from '@/hooks/useBreakpoint';

type Props = {
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
};

const Form = ({
  formId,
  onSubmit,
  form,
  loading,
  children,
  primaryButtonText,
  error,
  direction = 'column',
  width = '100%',
  sx,
  buttonClassName,
  isDisabled = true,
  buttonFullWidth = true,
  ...formProps
}: Props) => {
  const theme = useTheme();
  const isSmallScreen = useBreakpoint();
  const { t } = useTranslation();

  const {
    formState: { isDirty, isValid },
    getFieldState,
  } = form;

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
        <div className="flexRow justifyEnd">
          {!isSmallScreen || (!buttonFullWidth && <div />)}
          {!formId && (
            <Button
              className={buttonClassName}
              variant="contained"
              fullWidth={isSmallScreen || buttonFullWidth}
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
        </div>
      </Stack>
    </Box>
  );

  if (!form) return formComponent;

  return <FormProvider {...form}>{formComponent}</FormProvider>;
};

export default Form;
