import { MouseEvent, useState } from 'react';

import { Box, MenuItem, Menu, Divider, ListItemIcon, Typography, useTheme, Button, Theme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiChevronUp, FiPower, FiUser } from 'react-icons/fi';
import { IoPersonCircle } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import Avatar from '@/components/Avatar';

import { useBreakpoint } from '@/hooks/useBreakpoint';

import { getAppCurrentUserSelector } from '@/redux/reducers/app.reducer';

import { getCuttedFirstName, getUserFullName } from '@/utils/user.utils';
import { PATH_NAMES } from '@/utils/pathnames';

const AVATAR_SIZE = 100;

const getIconColor = (theme: Theme): string => (theme.palette.mode === 'light' ? '#000' : '#fff');

const sx = {
  profileLabel: {
    px: 1,
    color: (theme: Theme): string => (theme.palette.mode === 'light' ? grey[600] : '#fff'),
    fontWeight: 500,
  },
};

const ProfileMenu = () => {
  const currentUser = useSelector(getAppCurrentUserSelector);
  const theme = useTheme();
  const isDesktopDown = useBreakpoint();
  const { t } = useTranslation(['user']);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate({ to: PATH_NAMES.logout });
  };

  const handleGoToProfile = () => {
    navigate({ to: PATH_NAMES.profile });
  };

  if (!currentUser) return null;

  return (
    <Box>
      <Button onClick={handleOpen} className="flexRow alignCenter" sx={{ textTransform: 'capitalize' }} color="inherit">
        <Avatar user={currentUser} size={isDesktopDown ? 24 : 32} />
        {!isDesktopDown && (
          <>
            {currentUser && <Typography sx={sx.profileLabel}>{getCuttedFirstName(currentUser)}</Typography>}
            {open ? (
              <FiChevronUp size={18} color={getIconColor(theme)} />
            ) : (
              <FiChevronDown size={18} color={getIconColor(theme)} />
            )}
          </>
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        disableScrollLock
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 300,
            px: { xs: 0, xl: 2 },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem className="flexCenter" disableRipple>
          <Box className={isDesktopDown ? 'flexRow' : 'flexCenter'} pt={2}>
            {currentUser.image ? (
              <Box
                sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
                className="flexCenter">
                <IoPersonCircle size={AVATAR_SIZE} color={theme.palette.primary.main} />
              </Box>
            ) : (
              <Avatar user={currentUser} size={isDesktopDown ? 60 : 120} />
            )}
            <Box className={isDesktopDown ? 'flexColumn' : 'flexCenter'} sx={{ mt: 1.5, mb: 1, ml: { xs: 1, xl: 0 } }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {getUserFullName(currentUser)}
              </Typography>
              <Typography variant="body2">{currentUser.username}</Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleGoToProfile}>
          <ListItemIcon>
            <FiUser />
          </ListItemIcon>
          <Typography variant="subtitle1">{t('user:myProfile')}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <FiPower />
          </ListItemIcon>
          <Typography variant="subtitle1">{t('user:logout')}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
