import { Tooltip } from '@mui/material';
import Fab from '@mui/material/Fab';
import { FiSend } from 'react-icons/fi';

type Props = {
  onClick?: () => void;
};

// Copied from AddFab.tsx
const EmailFab = ({ onClick }: Props) => {
  return (
    <Tooltip title="Send email to this user" placement="top">
      <Fab
        onClick={onClick}
        color="primary"
        aria-label="add"
        sx={{
          margin: 0,
          top: 'auto',
          right: 30,
          bottom: 30,
          left: 'auto',
          position: 'fixed',
        }}>
        <FiSend size={26} />
      </Fab>
    </Tooltip>
  );
};

export default EmailFab;
