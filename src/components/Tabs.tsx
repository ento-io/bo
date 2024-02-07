import { SyntheticEvent, useEffect, useRef } from 'react';

import { cx } from '@emotion/css';
import { Theme } from '@emotion/react';
import { Tab, Tabs as MUITabs } from '@mui/material';

import { SPACING } from '@/utils/constants';

import { ISelectOption } from '@/types/app.type';

const classes = {
  tabsContainer: (theme: Theme) => ({
    height: 'calc(72px - 12px)',
    backgroundColor: '#fff',
    borderBottom: '1px solid ' + theme.palette.grey[100],
  }),
  tabsContent: (theme: Theme) => ({
    [theme.breakpoints.down('sm')]: {
      maxWidth: `calc(100vw - ${SPACING * 2}px)`,
    },
  }),
};

type Props = {
  onTabChange: (tab: any) => void;
  tab: any;
  options: ISelectOption[];
  className?: string;
  tabsClassName?: string;
};
const Tabs = ({ options, tab, onTabChange, className, tabsClassName }: Props) => {
  const currentTabRef = useRef(null);

  useEffect(() => {
    if (!currentTabRef.current) return;
    // the selected tab should always be into the view
    (currentTabRef.current as any)?.scrollIntoView({ behavior: 'auto', block: 'end' });
  }, []);

  const handleTabChange = (_: SyntheticEvent, value: any) => {
    onTabChange(value);
    currentTabRef.current = null;
  };

  return (
    <div className={cx('stretchSelf', className)} css={classes.tabsContainer}>
      <div css={classes.tabsContent}>
        <MUITabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable-setting-tabs"
          className={tabsClassName}
          TabIndicatorProps={{ sx: { display: 'none' } }}>
          {options.map((option: ISelectOption, index: number) => (
            <Tab
              key={index}
              label={option.label}
              value={option.value}
              className="flex1"
              // to get current tab position
              ref={option.value === tab ? currentTabRef : null}
            />
          ))}
        </MUITabs>
      </div>
    </div>
  );
};

export default Tabs;
