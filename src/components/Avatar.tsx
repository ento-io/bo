import { useTheme, SxProps, Theme, styled } from '@mui/material';
import MUIAvatar from '@mui/material/Avatar';

import { RESPONSIVE_BREAKPOINT } from '@/utils/constants';
import { getUserFullName, getUserFullNameAbbreviation } from '@/utils/user.utils';

import { IUser } from '@/types/user.type';

const SIZE = 56;

const StyledAvatarNoImage = styled(MUIAvatar)(({ theme }) => ({
  [theme.breakpoints.down(RESPONSIVE_BREAKPOINT)]: {
    '&.MuiAvatar-root': {
      fontSize: 14,
    },
  },
}));

type Props = {
  user: IUser;
  size?: number;
  sx?: Omit<SxProps<Theme>, 'size' | 'bgcolor'>;
};

const Avatar = ({ user, size = SIZE, sx }: Props) => {
  const theme = useTheme();

  if (!user.image) {
    return (
      <StyledAvatarNoImage sx={{ width: size, height: size, bgcolor: theme.palette.primary.main, ...sx }}>
        {getUserFullNameAbbreviation(user)}
      </StyledAvatarNoImage>
    );
  }

  return <MUIAvatar sx={{ width: size, height: size, ...sx }} alt={getUserFullName(user)} src={user.image.url} />;
};

export default Avatar;
