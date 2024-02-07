import { ReactNode } from 'react';

import { Box, styled, SxProps, Theme, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import { FaInfoCircle } from 'react-icons/fa';

const StyledFixedLabelText = styled(Typography)({
  marginRight: 6,
});

const StyledRequiredLabel = styled(Typography)(({ theme }) => ({
  color: grey[500],
  marginRight: 6,
  marginLeft: 6,
  [theme.breakpoints.down('sm')]: {
    fontSize: 14,
  },
}));

type Props = {
  label?: string | ReactNode;
  tooltip?: string;
  sx?: SxProps<Theme>;
  required?: boolean;
};

const InputLabel = ({ label, sx, tooltip, required }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 0.8, display: 'flex', alignItems: 'center', ...(sx ? sx : {}) }}>
      <StyledFixedLabelText>{label}</StyledFixedLabelText>{' '}
      {tooltip && (
        <Tooltip title={tooltip} placement="top">
          <span className="flexColumn">
            <FaInfoCircle color={grey[400]} size={16} />
          </span>
        </Tooltip>
      )}
      {required && <StyledRequiredLabel>({t('required')})</StyledRequiredLabel>}
    </Box>
  );
};

export default InputLabel;
