import Typography from '@mui/material/Typography';
import { MouseEvent } from 'react';
import Link from '@/components/Link';
import { getLinkStyles } from '@/utils/theme.utils';

type Props = {
  url?: string;
  text: string;
  label?: string;
  onClick?: () => void;
};

const AuthLink = ({ url, text, label, onClick }: Props) => {
  if (!onClick && !url) return null;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onClick?.();
  };

  return (
    <Typography className="textWhite" sx={{ textAlign: { xs: 'left', lg: 'center' } }}>
      {label}&nbsp;
      {/* ------- button ------- */}

      {!!onClick && (
        <button type="button" onClick={handleClick} className="transparentButton">
          <Typography css={getLinkStyles}>
            {text}
          </Typography>
        </button>
      )}

      {/* ------- link ------- */}
      {url && (
        <Link to={url}>
          {text}
        </Link>
      )}
    </Typography>
  );
};

export default AuthLink;
