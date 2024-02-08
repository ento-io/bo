import { ReactNode } from 'react';

import { Box, Button, Typography } from '@mui/material';

type Props = {
  onClick: () => void;
  text: string;
  icon: ReactNode;
  color?: string;
};

const InputActionButton = ({ onClick, text, icon, color }: Props) => {
  return (
    <Box mt={1}>
      <Button
        onClick={onClick}
        sx={{
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          color,
        }}>
        {icon}
        <Typography sx={{ ml: 1 }}>{text}</Typography>
      </Button>
    </Box>
  );
};

export default InputActionButton;
