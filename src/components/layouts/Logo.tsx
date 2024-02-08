import { styled, useTheme } from '@mui/material';

import { IMAGES } from '@/utils/constants';

export const StyledLogo = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: 75,
  },
  [theme.breakpoints.between('sm', 'md')]: {
    width: 90,
  },
  [theme.breakpoints.between('md', 'lg')]: {
    width: 100,
  },
  width: '40%',
}));

const Logo = () => {
  const theme = useTheme();

  if (theme.palette.mode === 'light') {
    return (
      <a href="/">
        <StyledLogo alt="logo" src={IMAGES.defaultLogo} />
      </a>
    );
  }

  return (
    <a href="/">
      <StyledLogo alt="logo" src={IMAGES.whiteLogo} />
    </a>
  );
};

export default Logo;
