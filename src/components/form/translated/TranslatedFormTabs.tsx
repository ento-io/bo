import { SyntheticEvent } from 'react';

import { Box, Stack, Tab, Tabs } from '@mui/material';

import { languagesOptions } from '@/utils/settings.utils';

import { ISelectOption } from '@/types/app.type';
import { Lang } from '@/types/setting.type';

import LanguageTab from './LanguageTab';

type Props = {
  onTabChange: (value: Lang) => void;
  tab: Lang;
  errors?: string[];
};

const TranslatedFormTabs = ({ onTabChange, tab, errors }: Props) => {
  const handleTabChange = (_: SyntheticEvent, value: Lang) => {
    onTabChange(value);
  };

  return (
    <Stack>
      <Box>
        <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
          {languagesOptions.map((languageOption: ISelectOption, index: number) => (
            <Tab
              label={<LanguageTab language={languageOption.value} label={languageOption.label} />}
              key={index}
              value={languageOption.value}
              sx={{
                textTransform: 'initial',
                letterSpacing: 1.2,
                // if there is any error for each tab
                color: errors?.includes(languageOption.value) ? 'error.main' : 'primary',
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Stack>
  );
};

export default TranslatedFormTabs;
