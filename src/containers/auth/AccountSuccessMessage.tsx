import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import { goToHome } from '@/redux/actions/app.action';
import { getAppAlertSelector } from '@/redux/reducers/app.reducer';

const AccountSuccessMessage = () => {
  const alert = useSelector(getAppAlertSelector);

  const theme = useTheme();
  const { t } = useTranslation(['user']);
  const navigate = useNavigate();

  // for react router error, go to home page instead, then it redirect to the login page
  const handleGoToHome = () => navigate(goToHome());

  return (
    <Box sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box className="flexCenter">
          <FaCheckCircle size={40} color={theme.palette.success.main} />
          {alert.title && (
            <Typography color="success.main" variant="h5" sx={{ ml: 2, mt: 2 }}>
              {alert.title}
            </Typography>
          )}
        </Box>
        <Box mt={3}>
          <Typography textAlign="center" css={{ fontSize: 18, color: '#fff' }}>
            {alert.message}
          </Typography>
        </Box>
        <Button variant="contained" disableElevation sx={{ textTransform: 'capitalize' }} onClick={handleGoToHome}>
          {t('user:login')}
        </Button>
      </Stack>
    </Box>
  );
};

export default AccountSuccessMessage;
