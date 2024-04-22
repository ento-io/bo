import { SyntheticEvent } from 'react';

import { Tab, Tabs, Theme } from '@mui/material';

import { languagesOptions } from '@/utils/settings.utils';

import { ISelectOption } from '@/types/app.type';
import { Lang } from '@/types/setting.type';

import LanguageTab from './LanguageTab';

const classes = {
  tabs: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      width: '100%',
    },
  }),
  tab: (hasError: boolean) => (theme: Theme) => ({
    textTransform: 'initial' as const,
    letterSpacing: 1.2,
    // if there is any error for each tab
    color: hasError ? theme.palette.error.main : theme.palette.primary.main,
    '& .MuiTypography-root': {
      fontSize: 16,
    },
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  }),
}
type Props = {
  onTabChange: (value: Lang) => void;
  tab: Lang;
  errors?: string[];
  className?: string;
};

const TranslatedFormTabs = ({ onTabChange, tab, errors, className }: Props) => {
  const handleTabChange = (_: SyntheticEvent, value: Lang) => {
    onTabChange(value);
  };

  return (
    <Tabs
      value={tab}
      onChange={handleTabChange}
      aria-label="language selection tabs"
      className={className}
      css={classes.tabs}
    >
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
