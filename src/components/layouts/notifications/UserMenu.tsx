import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { FiUserPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import { loadUsers } from '@/redux/actions/user.action';
import { getAppNotificationsSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector, getUserUsersSelector } from '@/redux/reducers/user.reducer';

import { NOTIFICATIONS_COUNT } from '@/utils/constants';
import { getUserFullName } from '@/utils/user.utils';

import { INotificationMenu } from '@/types/app.type';
import { IUser } from '@/types/user.type';

import NotificationsMenu from './NotificationsMenu';
import { PATH_NAMES } from '@/utils/pathnames';

const UserMenu = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'user']);
  const navigate = useNavigate();
  const users = useSelector(getUserUsersSelector);
  const notification = useSelector(getAppNotificationsSelector);
  const loading = useSelector(getUserLoadingSelector);

  const onOpen = async () => {
    // load only unseen users
    const values = {
      localLoading: true, // use only local loading instead of the page global loading
      limit: NOTIFICATIONS_COUNT,
      filters: { seen: false },
    };

    dispatch(loadUsers(values));
  };

  // list of notification
  const items = useMemo((): INotificationMenu[] => {
    return users.map(
      (user: IUser): INotificationMenu => ({
        objectId: user.objectId,
        user,
        title: user ? getUserFullName(user) : '',
        description: user.platform as string, // plateform is an enum, so force it to string
        date: user.createdAt,
        onClick: () => navigate({ to: PATH_NAMES.users.preview, params: { id: user.objectId }}),
        
      }),
    );
  }, [users, navigate]);

  const onSeeAll = () => {
   navigate({ to: PATH_NAMES.users.index});
  };

  return (
    <NotificationsMenu
      icon={<FiUserPlus size={22} color="#949DB2" />}
      onOpen={onOpen}
      loading={loading}
      items={items}
      title={t('user:users')}
      count={notification.user ?? 0}
      onSeeAll={onSeeAll}
      seeAllLinkText={t('user:seeAllNewUsers', { count: notification.user })}
      badgeColor="info"
    />
  );
};

export default UserMenu;
