import Typography from '@mui/material/Typography';
import Link from '@/components/Link';

type Props = {
  url?: string;
  text: string;
  label?: string;
};

const AuthLink = ({ url, text, label }: Props) => {
  return (
    <Typography className="textWhite" sx={{ textAlign: { xs: 'left', lg: 'center' } }}>
      {label}&nbsp;
      {/* ------- button ------- */}

      {/* ------- link ------- */}
      <Link to={url}>
        {text}
      </Link>
    </Typography>
  );
};

export default AuthLink;
