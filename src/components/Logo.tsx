import { useTheme } from '@mui/material';

import { Theme } from '@emotion/react';
import { IMAGES } from '@/utils/constants';

const classes = {
  logo: (width = 100) => (theme: Theme) => ({
    [theme.breakpoints.down('sm')]: {
      width: 75,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 90,
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: 100,
    },
    width,
  })
}

/**
 * the original svg is w=100px h=23.44px
 * @returns 
 */
type Props = {
  width?: number;
}
const Logo = ({ width }: Props) => {
  const theme = useTheme();

  return (
    <a href="/">
      <img
        alt="logo"
        src={theme.palette.mode === 'light' ? IMAGES.defaultLogo : IMAGES.whiteLogo}
        css={classes.logo(width)}
      />
    </a>
  );
};

export default Logo;
