import { useCallback, useEffect } from 'react';

import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { FiMenu } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';

import { Outlet } from '@tanstack/react-router';
import SnackBar from '@/components/SnackBar';

import { useBreakpoint } from '@/hooks/useBreakpoint';

import {
  closeErrorSlice,
  closeMessageSlice,
  getAppErrorSelector,
  getAppInfoMessageSelector,
  getAppLoadingSelector,
  getAppMessageSelector,
} from '@/redux/reducers/app.reducer';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import {
  changeIsSideBarOpenSlice,
  getSettingsIsSideBarOpenSelector,
} from '@/redux/reducers/settings.reducer';


import { RESPONSIVE_BREAKPOINT, SIDEBAR_WIDTH } from '@/utils/constants';

import AppBar from '../components/layouts/AppBar';
import SideBar from '../components/layouts/sidebar/SideBar';
import Logo from '@/components/Logo';

const openedMixin = (theme: Theme): CSSObject => ({
  [theme.breakpoints.up(RESPONSIVE_BREAKPOINT)]: {
    width: SIDEBAR_WIDTH, // THIS ONLY CHANGES DRAWER WIDTH NOT PAPER WIDTH INSIDE THE DRAWER
  },
  [theme.breakpoints.down(RESPONSIVE_BREAKPOINT)]: {
    width: '100vw', // THIS ONLY CHANGES DRAWER WIDTH NOT PAPER WIDTH INSIDE THE DRAWER
  },
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  [theme.breakpoints.up(RESPONSIVE_BREAKPOINT)]: {
    width: SIDEBAR_WIDTH, // THIS ONLY CHANGES DRAWER WIDTH NOT PAPER WIDTH INSIDE THE DRAWER
  },
  [theme.breakpoints.down(RESPONSIVE_BREAKPOINT)]: {
    width: '100%', // THIS ONLY CHANGES DRAWER WIDTH NOT PAPER WIDTH INSIDE THE DRAWER
  },
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': {
      ...openedMixin(theme),
      [theme.breakpoints.up(RESPONSIVE_BREAKPOINT)]: {
        borderRightWidth: theme.palette.mode === 'dark' ? 0 : 1,
        width: SIDEBAR_WIDTH, // THIS ONLY CHANGES DRAWER WIDTH NOT PAPER WIDTH INSIDE THE DRAWER
      },
      [theme.breakpoints.down(RESPONSIVE_BREAKPOINT)]: {
        width: '100%', // THIS ONLY CHANGES DRAWER WIDTH NOT PAPER WIDTH INSIDE THE DRAWER
      },
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': {
      ...closedMixin(theme),
      [theme.breakpoints.up(RESPONSIVE_BREAKPOINT)]: {
        borderRightWidth: theme.palette.mode === 'dark' ? 0 : 1,
      },
    },
  }),
}));

type StyledMainProps = {
  theme?: Theme;
  open: boolean;
};
const StyledMain = styled(Box, { shouldForwardProp: prop => prop !== 'open' })<StyledMainProps>(({ theme, open }) => ({
  [theme.breakpoints.down(RESPONSIVE_BREAKPOINT)]: {
    display: open ? 'none' : 'block',
    paddingTop: 6,
  },
}));

const sx = {
  drawer: (open: boolean) => ({
    display: { xl: 'block', sm: open ? 'block' : 'none', xs: open ? 'block' : 'none' }, // responsive
    boxShadow: 'none',
    border: 'none',
    '& .MuiPaper-root': {
      borderColor: 'none',
      '&::-webkit-scrollbar': {
        width: 6,
      },

      /* Track */
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 5px grey',
        borderRadius: 6,
        display: 'none',
        transition: 'background .2s linear,display .2s ease-in-out',
        WebkitTransition: 'background .2s linear,display .2s ease-in-out',
      },

      /* Handle */
      '&::-webkit-scrollbar-thumb': {
        background: '#aaa',
        borderRadius: 6,
        display: 'none',
        transition: 'background .2s linear,display .2s ease-in-out',
        WebkitTransition: 'background .2s linear,display .2s ease-in-out',
      },

      /* Handle on hover */
      '&:hover::-webkit-scrollbar-thumb, &:hover::-webkit-scrollbar-track ': {
        display: 'block',
      },
    },
  }),
};

const DashboardLayout = () => {
  const loading = useSelector(getAppLoadingSelector);
  const error = useSelector(getAppErrorSelector);
  const message = useSelector(getAppMessageSelector);
  const infoMessage = useSelector(getAppInfoMessageSelector);

  const roles = useSelector(getRoleCurrentUserRolesSelector);
  const isSideBarOpen = useSelector(getSettingsIsSideBarOpenSelector);
  const dispatch = useDispatch();
  const isDesktopDown = useBreakpoint();

  const handleDrawerOpen = useCallback(() => {
    dispatch(changeIsSideBarOpenSlice(true));
  }, [dispatch]);

  const handleDrawerClose = () => {
    dispatch(changeIsSideBarOpenSlice(false));
  };

  useEffect(() => {
    if (isDesktopDown) return;
    handleDrawerOpen();
  }, [isDesktopDown, handleDrawerOpen]);

  // clear message or error
  const toggleSnackBar = () => {
    dispatch(closeErrorSlice());
    dispatch(closeMessageSlice());
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {loading && (
        <LinearProgress color="primary" sx={{ position: 'fixed', top: 0, width: '100%', height: 6, zIndex: 2000 }} />
      )}
      <CssBaseline />
      {/* ---------- left (sidebar ) ---------- */}
      <Drawer
        variant="permanent"
        open={isSideBarOpen}
        sx={sx.drawer(isSideBarOpen)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}>
        <DrawerHeader>
          {!isSideBarOpen ? (
            <Box className="flexCenter" alignSelf="stretch" flex={1}>
              <IconButton onClick={handleDrawerOpen}>
                <FiMenu />
              </IconButton>
            </Box>
          ) : (
            <Box
              className="flexRow stretchSelf spaceBetween center flex1"
              pl={{ xs: 0, xl: 2 }}>
              <Logo />
              <IconButton onClick={handleDrawerClose}>
                <FiMenu />
              </IconButton>
            </Box>
          )}
        </DrawerHeader>
        <SideBar open={isSideBarOpen} roles={roles} onClose={handleDrawerClose} />
      </Drawer>

      {/* ------- right (main content ) ------- */}
      <StyledMain
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 0, lg: 3 },
          pb: 3,
          // bgcolor: (theme: Theme) => theme.palette.background.default,
          minHeight: '100vh',
        }} // main background
        className="flexColumn positionRelative"
        open={isSideBarOpen}>
        <AppBar onOpenDrawer={handleDrawerOpen} />
        <DrawerHeader />
        <Box
          className="flexColumn stretchSelf flex1"
          sx={{
            p: { xs: 1.2, lg: 2 },
            pt: 0,
            borderRadius: 1,
          }}>
          <Outlet />
        </Box>
      </StyledMain>
      <SnackBar open={!!error} message={error} severity="error" toggle={toggleSnackBar} />
      <SnackBar open={!!infoMessage} message={infoMessage} severity="info" toggle={toggleSnackBar} />
      <SnackBar open={!!message} message={message} severity="success" toggle={toggleSnackBar} />
    </Box>
  );
};

export default DashboardLayout;
