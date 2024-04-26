import { SyntheticEvent, useLayoutEffect, useRef, useState } from 'react';

import { Tab, Tabs, Theme } from '@mui/material';

import { languagesOptions } from '@/utils/settings.utils';

import { ISelectOption } from '@/types/app.type';
import { Lang } from '@/types/setting.type';

import LanguageTab from './LanguageTab';

const classes = {
  tabsContainer: (fixed: boolean) => (theme: Theme) => {
    if (fixed) {
      return {
        position: 'fixed' as const,
        top: 0,
        zIndex: 10000,
        backgroundColor: 'red',
        [theme.breakpoints.down('sm')]: {
          right: 0,
          left: 0,
        },
      };
    }

    return { position: 'relative' as const };
  },
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
  fixedOnScroll?: boolean;
};

const TranslationTabs = ({ onTabChange, tab, errors, className, fixedOnScroll = false }: Props) => {
  const divToFixedRef = useRef(null);
  const [fixed, setFixed] = useState<boolean>(false);

  // fix the tabs on top when scrolling
  useLayoutEffect(() => {
    if (!fixedOnScroll) return;
    if (!divToFixedRef.current) return;
    const current = divToFixedRef.current as HTMLDivElement;
    const divAnimate = current.getBoundingClientRect().top;
    const onScroll = () => {
      if (divAnimate < window.scrollY) {
        setFixed(true);
      } else {
        setFixed(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fixedOnScroll]);

  const handleTabChange = (_: SyntheticEvent, value: Lang) => {
    onTabChange(value);
  };

  return (
    <div ref={divToFixedRef} css={classes.tabsContainer(fixed)}>
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
    </div>
  );
};

export default TranslationTabs;
