import { Badge, Stack, Tooltip } from '@mui/material';
import { FiCloudSnow } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { getAppNotificationsSelector } from '@/redux/reducers/app.reducer';
import { goToEstimates } from '@/redux/actions/estimate.action';

type IOption = {
  icon: ReactNode;
  color: 'info';
  key: 'estimate';
  label: string;
  onClick: () => void;
};

const NotificationIcons = () => {
  const notifications = useSelector(getAppNotificationsSelector);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const notificationOptions: IOption[] = [
    {
      icon:  <FiCloudSnow />,
      color: 'info',
      key: 'estimate',
      label: t('estimates.estimate'),
      onClick: () => navigate((goToEstimates({ tab: t('route.new') })))
    }
  ];

  return (
    <Stack direction="row">
      {notificationOptions.map((notification: IOption, index: number) => (
        <Tooltip title={notification.label} key={notification.key + index}>
          <Badge
            badgeContent={notifications[notification.key]}
            color={notification.color as any || 'secondary'}
            max={99}
            onClick={notification.onClick}
            css={{ '&:hover': { cursor: 'pointer' }}}
          >
            {notification.icon}
          </Badge>
        </Tooltip>
      ))}      
    </Stack>
  );
};

export default NotificationIcons;
