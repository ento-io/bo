import { ReactNode } from 'react';

import { Box, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useTheme from '@mui/material/styles/useTheme';
import { useSelector } from 'react-redux';

import { useBreakpoint } from '@/hooks/useBreakpoint';

import { getSettingsThemeSelector } from '@/redux/reducers/settings.reducer';

import { ISubMenu } from './SideBar';

const TEXT_COLOR = grey[700];

const sx = {
  itemText: {
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 1.5,
    fontWeight: 400,
    color: TEXT_COLOR,
  },
  subMenuHeader: {
    lineHeight: 1.57,
    fontWeight: 500,
    opacity: 0.8,
    letterSpacing: 0.8,
    color: TEXT_COLOR,
    textTransform: 'uppercase',
    mt: 2.4,
    mb: 1.5,
  },
  notification: (open: boolean) => ({
    px: 0.8,
    pt: 0.5,
    pb: 0.3,
    borderRadius: 2,
    position: 'absolute',
    right: open ? 0 : -8,
    top: open ? -10 : -16,
  }),
};

type Props = {
  open: boolean;
  subMenu: ISubMenu;
  rightIcon?: ReactNode;
  isLevel2?: boolean;
  isSelected?: boolean;
  onClose: () => void;
};

const SideBarItem = ({ open, subMenu, rightIcon, isSelected, onClose, isLevel2 = false }: Props) => {
  const theme = useTheme();
  const isDesktopDown = useBreakpoint();

  const palette = useSelector(getSettingsThemeSelector);

  const handleCloseItem = (subMenu: ISubMenu) => {
    if (!isDesktopDown) {
      // redirect to the page
      subMenu.onClick();
      return;
    }

    // close the sidebar when clicking on it
    onClose();
    // then redirect to the page
    subMenu.onClick();
  };

  return (
    <ListItem
      disablePadding
      sx={{ display: 'block', px: { sm: 0, xs: 0, md: 2 }, mb: { sm: 0, xs: 0, md: 1 }, position: 'relative' }}
      secondaryAction={
        subMenu.notification && subMenu.notification > 0 ? (
          <Box bgcolor="#F61011" sx={sx.notification(open)} className="flexCenter">
            <Typography sx={{ color: '#fff', fontSize: 13, p: 0, lineHeight: 1 }}>{subMenu.notification}</Typography>
          </Box>
        ) : null
      }>
      <ListItemButton
        selected={isSelected}
        onClick={() => handleCloseItem(subMenu)}
        sx={{
          pl: isLevel2 ? 4 : 2,
          pr: 2,
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          borderRadius: { sm: 0, xs: 0, md: 2 },
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              opacity: 0.8,
            },
            '& .MuiListItemText-primary': {
              color: '#fff',
            },
          },
        }}>
        <Tooltip title={open ? '' : subMenu.label} placement="right">
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              ...(isSelected ? { color: '#fff' } : { color: palette === 'dark' ? '#fff' : TEXT_COLOR }),
            }}>
            {subMenu.icon}
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary={subMenu.label} sx={{ opacity: open ? 1 : 0 }} primaryTypographyProps={sx.itemText} />
        {rightIcon}
      </ListItemButton>
    </ListItem>
  );
};

export default SideBarItem;
