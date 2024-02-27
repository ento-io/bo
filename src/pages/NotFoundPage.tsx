import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Theme } from '@emotion/react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const classes = {
  card: (theme: Theme) => ({
    [theme.breakpoints.between('sm', 'md')]: {
      boxShadow: 'none'
    },
    padding: 16
  }),
}
const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useBreakpoint();

  const goToHome = ()=> navigate({ to: '/' });

  return (
    <Paper css={{ minHeight: '100vh' }} className={isMobile ? '': 'flexCenter'}>
      <Card css={classes.card} className="flexCenter"> 
        <CardContent className="flexCenter">
          <Typography gutterBottom variant={isMobile ? 'h4' : 'h2'} className='grey300' css={{ fontWeight: 500 }}>
            404
          </Typography>
          <Typography variant="body2" className='grey600' css={{ fontSize: 24, fontWeight: 'bold' }}>
            {t('pageNotFound')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={goToHome}>{t('returnToHome')}</Button>
        </CardActions>
      </Card>
    </Paper>
  );
}

export default NotFoundPage;