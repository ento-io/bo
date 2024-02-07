import { Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FiLock } from 'react-icons/fi';

import { DEFAULT_LANGUAGE } from '@/utils/constants';

type Props = {
  label: string;
  language: string;
};

const LanguageTab = ({ label, language }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={0.3} alignItems="center">
      <Typography>{label}</Typography>
      {language === DEFAULT_LANGUAGE && (
        <Tooltip title={t('default')}>
          <div className="flexColumn">
            <FiLock color={theme.palette.info.main} size={16} />
          </div>
        </Tooltip>
      )}
    </Stack>
  );
};

export default LanguageTab;
