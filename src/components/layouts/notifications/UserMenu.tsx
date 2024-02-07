import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { FiUserPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import { goToUser, goToUsers, loadUsers } from '@redux/actions/user.action';
import { getAppNotificationsSelector } from '@redux/reducers/app.reducer';
import { getUserLoadingSelector, getUserUsersSelector } from '@redux/reducers/user.reducer';

import { NOTIFICATIONS_COUNT } from '@utils/constants';
import { getUserFullName } from '@utils/user.utils';

import { INotificationMenu } from 'types/app.type';
import { IUser } from 'types/user.type';

import NotificationsMenu from './NotificationsMenu';

const UserMenu = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'user']);
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
        user: user,
        title: user ? getUserFullName(user) : '',
        description: user.platform as string, // plateform is an enum, so force it to string
        date: user.createdAt,
        onClick: () => dispatch(goToUser(user.objectId)),
      }),
    );
  }, [users, dispatch]);

  const onSeeAll = () => {
    dispatch(goToUsers());
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
