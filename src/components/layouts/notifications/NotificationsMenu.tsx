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
  styled,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useTranslation } from 'react-i18next';

import Avatar from '@components/Avatar';

import { fromNow } from '@utils/date.utils';
import { capitalizeFirstLetter, cutText } from '@utils/utils';

import { INotificationMenu } from 'types/app.type';

const sx = {
  menu: {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      maxWidth: 500,
      px: { xs: 0, xl: 2 },
      pt: { xs: 0, xl: 0.6 },
      pb: { xs: 0, xl: 1 },
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
  },
};

const StyledMenuItemTitle = styled(MenuItem)({
  justifyContent: 'space-between !important',
});

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
        PaperProps={sx.menu}
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
              <StyledMenuItemTitle disableRipple key={'notification-menu-' + title} className="flexRow center">
                <Typography variant="h6">{title}</Typography>
                <Box sx={{ bgcolor: 'warning.light', ml: 2, pr: 2, pl: 1, borderRadius: 1.8 }} className="flexCenter">
                  <Typography sx={{ color: '#fff', fontSize: 14 }}>{t('common:newCount', { count })}</Typography>
                </Box>
              </StyledMenuItemTitle>
            ),
            // data from db
            title && <Divider key={'title-divider' + title} />,
            ...items.map((item: INotificationMenu, index: number) => [
              <MenuItem disableRipple key={item.objectId} onClick={item.onClick}>
                <Stack direction="row" spacing={2}>
                  {item.user && (
                    <Box className="flexCenter">
                      <Avatar user={item.user} size={70} />
                    </Box>
                  )}
                  <Stack direction="column">
                    <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: grey[500] }}>
                      {capitalizeFirstLetter(cutText(item.description || 'undefined', 50))}
                      {/* {capitalizeFirstLetter(cutText(item.description, 50))} */}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: grey[500], fontSize: 14 }} noWrap>
                      {capitalizeFirstLetter(fromNow(item.date))}
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
            sx={{ justifyContent: 'flex-end' }}>
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
