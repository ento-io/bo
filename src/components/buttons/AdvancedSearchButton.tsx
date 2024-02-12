import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  onClick: () => void;
};
const AdvancedSearchButton = ({ onClick }: Props) => {
  const { t } = useTranslation();

  return (
    <Button onClick={onClick} variant="contained" disableElevation>
      {t('advancedSearch')}
    </Button>
  );
};

export default AdvancedSearchButton;
