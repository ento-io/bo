import { SyntheticEvent } from 'react';

import { Tab, Tabs, Theme } from '@mui/material';

import { languagesOptions } from '@/utils/settings.utils';

import { ISelectOption } from '@/types/app.type';
import { Lang } from '@/types/setting.type';

import LanguageTab from './LanguageTab';

const classes = {
  tab: (hasError: boolean) => (theme: Theme) => ({
    textTransform: 'initial' as const,
    letterSpacing: 1.2,
    // if there is any error for each tab
    color: hasError ? theme.palette.error.main : theme.palette.primary.main,
    '& .MuiTypography-root': {
      fontSize: 16,
    }
  }),
}
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
    <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
      {languagesOptions.map((languageOption: ISelectOption, index: number) => (
        <Tab
          label={<LanguageTab language={languageOption.value} label={languageOption.label} />}
          key={index}
          value={languageOption.value}
          css={classes.tab(!!errors?.includes(languageOption.value))}
        />
      ))}
    </Tabs>
  );
};

export default TranslatedFormTabs;
