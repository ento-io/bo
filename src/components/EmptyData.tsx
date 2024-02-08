import { Box, SxProps, Theme } from '@mui/material';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { FiSlash } from 'react-icons/fi';

type Props = {
  text?: string;
  sx?: SxProps<Theme>;
};

const EmptyData = ({ text, sx }: Props) => {
  const { t } = useTranslation();

  return (
    <Box className="flexCenter flex1 stretchSelf" sx={sx}>
      <FiSlash size={28} color={grey[600]} />
      <Typography sx={{ mt: 1 }}>{text ?? t('noDataAvailable')}</Typography>
    </Box>
  );
};

export default EmptyData;
