import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { SyntheticEvent, forwardRef, useEffect, useState } from 'react';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

type Props = {
  message: string;
  show: boolean;
  severity?: AlertColor
}
const Notification = ({ message, show, severity = 'success' }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(show)
  }, [show])


  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
  );
}

export default Notification;
