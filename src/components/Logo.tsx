import { useTheme } from '@mui/material';

import { Theme } from '@emotion/react';
import { IMAGES } from '@/utils/constants';

const classes = {
  logo: (theme: Theme) => ({
    [theme.breakpoints.down('sm')]: {
      width: 75,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 90,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 100,
    },
    width: '100%',
  })
}

/**
 * the original svg is w=100px h=23.44px
 * @returns 
 */
const Logo = () => {
  const theme = useTheme();

  if (theme.palette.mode === 'light') {
    return (
      <a href="/">
        <img alt="logo" src={IMAGES.defaultLogo} css={classes.logo} />
      </a>
    );
  }

  return (
    <a href="/">
      <img alt="logo" src={IMAGES.whiteLogo} css={classes.logo} />
    </a>
  );
};

export default Logo;
