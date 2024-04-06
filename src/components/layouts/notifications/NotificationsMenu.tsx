import { MouseEvent, ReactNode, useState } from 'react';

import {
  Box,
  MenuItem,
  Menu,
  Divider,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Badge,
  Theme,
  useTheme,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

import { css } from '@emotion/css';
import Avatar from '@/components/Avatar';

import { fromNow } from '@/utils/date.utils';
import { capitalizeFirstLetter, cutText } from '@/utils/utils';

import { INotificationMenu } from '@/types/app.type';

const classes = {
  menu: (theme: Theme) => css({
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    marginTop: 1.58,
    minWidth: '400px !important',
    paddingLeft: 4,
    paddingRight: 4,
    paddingBottom: 2,
    paddingTop: 2,
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
    [theme.breakpoints.down('xl')]: {
      padding: 0,
    },
  }),
  menuTitle: {
    justifyContent: 'space-between !important',
  },
  menuItem: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03) !important',
    },
  },
  noBackground: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
  menuItemFooter: {
    justifyContent: 'flex-end',
  }
}

type Props = {
  items: INotificationMenu[];
  icon: ReactNode;
  onOpen: () => void;
  loading: boolean;
  title?: string;
  count?: number;
  onSeeAll: () => void;
  seeAllLinkText: string;
  badgeColor?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
};

const NotificationsMenu = ({
  items,
  icon,
  onOpen,
  loading,
  title,
  onSeeAll,
  seeAllLinkText,
  badgeColor = 'error',
  count = 0,
}: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button onClick={handleOpen}>
        <Badge badgeContent={count} color={badgeColor} sx={{ '& .MuiBadge-badge': { color: '#fff' } }}>
          {icon}
        </Badge>
      </Button>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock
        slotProps={{
          paper: {
            elevation: 0,
            className: classes.menu(theme),
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        {loading ? (
          <MenuItem disableRipple key={'loading-menu-' + title}>
            <Box className="flexCenter" py={4} flex={1} alignSelf="stretch" sx={{ width: 200 }}>
              <CircularProgress size={22} />
            </Box>
          </MenuItem>
        ) : (
          // use an array instead of Fragment because the children of Menu should be an array or list of MenuItem
          [
            title && (
              <MenuItem disableRipple key={'notification-menu-' + title} className="flexRow center" css={[classes.menuTitle, classes.noBackground]}>
                <Typography variant="h5" css={{ fontSize: 20 }}>{title}</Typography>
                <Box sx={{ bgcolor: 'warning.light', ml: 2, pr: 2, pl: 1, borderRadius: 1.8 }} className="flexCenter">
                  <Typography sx={{ color: '#fff', fontSize: 14 }}>{t('common:newCount', { count })}</Typography>
                </Box>
              </MenuItem>
            ),
            // data from db
            title && <Divider key={'title-divider' + title} />,
            ...items.map((item: INotificationMenu, index: number) => [
              <MenuItem disableRipple key={item.objectId} onClick={item.onClick} css={classes.menuItem} className="yellow">
                <Stack direction="row" spacing={2} flex={1}>
                  {item.user && (
                    <Box>
                      <Avatar user={item.user} size={40} />
                    </Box>
                  )}
                  <Stack direction="column" flex={1}>
                    <Stack direction="row" justifyContent="space-between" alignSelf="stretch" alignItems="center">
                      <Typography variant="body1" css={{ fontWeight: 600, fontSize: 16 }} noWrap>
                        {item.title}
                      </Typography>
                        <Typography variant="subtitle1" sx={{ color: grey[500], fontSize: 14 }} noWrap>
                        {capitalizeFirstLetter(fromNow(item.date))}
                      </Typography>
                    </Stack>
  
                    <Typography variant="body1" sx={{ color: grey[500] }}>
                      {capitalizeFirstLetter(cutText(item.description || 'undefined', 50))}
                    </Typography>
                  </Stack>
                </Stack>
              </MenuItem>,
              items.length === index && <Divider key={'divider-' + item.objectId} />,
            ]),
          ]
        )}

        {!loading && items.length > 0 && (
          // see all link
          <MenuItem
            disableRipple
            key={'see-all-' + title}
            onClick={onSeeAll}
            className="flexRow flex1"
            css={[classes.menuItemFooter, classes.noBackground]}
          >
            <Button>
              <Typography sx={{ textTransform: 'initial' }}>{seeAllLinkText}</Typography>
            </Button>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default NotificationsMenu;
