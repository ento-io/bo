import { Box, Tab, Tabs, Theme } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IListTabValue, ITabSearchParams } from '@/types/app.type';

const classes = {
  tab: (theme: Theme) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: theme.palette.mode === 'light' ? '#000' : '#fff',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  })
}

type Props<T extends ITabSearchParams> = {
  tabs?: IListTabValue[];
  clearPagination?: () => void;
  onTabChange?: (tabValue: string) => void;
  mb?: number;
  searchParams: T;
};

const ListTabs = <T extends ITabSearchParams>({
  tabs,
  clearPagination,
  onTabChange,
  searchParams,
  mb = 0
}: Props<T>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // add the translated tab value to the url search params
  // use these url search params as a filter to query in database
  const handleChange = (_: any, tabValue: string) => {
    // reset pagination to page 1
    clearPagination?.();

    onTabChange?.(tabValue);
    if (tabValue === t('route.all')) {
      navigate({ search: null });
      return;
    }

    navigate({ search: { tab: tabValue } });
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={mb}>
      <Tabs value={searchParams.tab ?? t('route.all')} onChange={handleChange} aria-label="list tabs">
        <Tab
          css={classes.tab}
          disableRipple
          label={t('all')}
          value={t('route.all')}
        />
        {/* <Tab disableRipple label={t('news')} value={t('route.new')} /> */}
        {tabs?.map((tab: IListTabValue, index: number) => (
          <Tab
            css={classes.tab}
            disableRipple
            label={tab.label}
            value={tab.tab}
            key={tab.tab + index}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ListTabs;
