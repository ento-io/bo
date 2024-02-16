import { useTheme } from '@mui/material';
import { FiCheck, FiX } from 'react-icons/fi';

type Props = {
  value: boolean;
};
const BooleanIcons = ({ value }: Props) => {
  const theme = useTheme();
  if (value) {
    return <FiCheck color={theme.palette.success.main} />;
  }

  return <FiX color={theme.palette.error.main} />;
};

export default BooleanIcons;
