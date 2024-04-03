import { Badge, BadgeProps, Box, Stack, StackOwnProps, Typography, styled, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

import Avatar from '@/components/Avatar';

import { getUserFullName } from '@/utils/user.utils';
import { IUser } from '@/types/user.type';
import { PATH_NAMES } from '@/utils/pathnames';
import Link from '@/components/Link';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

type Props = {
  user: IUser;
  direction?: StackOwnProps['direction'];
};

const UserInfo = ({ user, direction = 'column' }: Props) => {
  const theme = useTheme();

  return (
    <Stack direction={direction} spacing={direction === 'column' ? 0 : 1} alignItems={direction === 'column' ? 'center' : 'flex-start'}>
      <div className={direction === 'column' ? '' : 'flexCenter stretchSelf'}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: user.isOnline ? theme.palette.success.main : theme.palette.error.main,
              color: user.isOnline ? theme.palette.success.main : theme.palette.error.main,
            },
          }}>
          <Avatar user={user} size={direction === 'column' ? 64 : 32} />
        </StyledBadge>
      </div>
      <div>
        <Box mt={direction === 'column' ? 1 : 0}>
          <Typography variant="h6" sx={{ textAlign: direction === 'column' ? 'center' : 'left' }}>
            <Link
              to={PATH_NAMES.users + '/$id'}
              params={{
                id: user.objectId,
              }}
              css={{ textDecoration: 'none', color: '#000' }}>
              {getUserFullName(user)}
            </Link>
          </Typography>
        </Box>
        <div>
          <Typography sx={{ color: grey[500] }}>{user.username}</Typography>
        </div>
      </div>
    </Stack>
  );
};

export default UserInfo;
