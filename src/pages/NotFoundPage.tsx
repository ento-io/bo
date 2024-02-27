import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  return (
    <Paper css={{ minHeight: '100vh' }} className='flexCenter'>
      <Card css={{ padding: 1 }} className='flexCenter' > 
        <CardContent className='flexCenter'>
          <Typography gutterBottom variant="h5" component="div" className='grey300' css={{ fontSize: 50}}>
            404
          </Typography>
          <Typography variant="body2" className='grey600' css={{ fontSize: 24, fontWeight: 'bold'}}>
            {t('pageNotFound')}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant= 'contained' onClick={()=> navigate({ to: '/' })}>{t('previous')}</Button>
        </CardActions>
      </Card>
    </Paper>
  );
}

export default NotFoundPage;