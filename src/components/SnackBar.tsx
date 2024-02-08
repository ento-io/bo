import { forwardRef } from 'react';

import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import MUISnackbar from '@mui/material/Snackbar';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

type Props = {
  open?: boolean;
  toggle: () => void;
  message: string;
  severity: AlertColor;
  duration?: number;
};

const SnackBar = ({ open, toggle, message, duration = 6000, severity = 'success' }: Props) => {
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    toggle();
  };

  return (
    <MUISnackbar open={open} autoHideDuration={duration} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: '100%',
          '& .MuiAlert-message, & .MuiAlert-icon, & .MuiButtonBase-root': {
            color: '#fff',
          },
        }}>
        {message}
      </Alert>
    </MUISnackbar>
  );
};

export default SnackBar;
