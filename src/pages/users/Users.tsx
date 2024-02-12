import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';

import { ReactNode, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { getUserCountSelector, getUserUsersSelector } from '@/redux/reducers/user.reducer';
import { IUser } from '@/types/user.type';
import { deleteUserById, deleteUsersById, goToUser, loadUsers } from '@/redux/actions/user.action';
import List from '@/components/table/List';
import { displayDate } from '@/utils/date.utils';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IQueriesInput, TableHeadCell } from '@/types/app.type';
import Avatar from '@/components/Avatar';
import ButtonActions from '@/components/ButtonActions';
import { capitalizeFirstLetter } from '@/utils/utils';
import { getUserFullName } from '@/utils/user.utils';
import Head from '@/components/Head';
import SearchInput from '@/components/form/inputs/SearchInput';
import UserAdvancedFilterForm from '@/containers/users/UserAdvancedFilterForm';


interface Data {
  id: string;
  avatar: ReactNode;
  fullName: string;
  email: string;
  createdAt: ReactNode;
  actions: ReactNode;
  platform: string;
  birthday: string;
}

const headCells: TableHeadCell<keyof Data>[] = [
  {
    id: 'fullName',
    numeric: false,
    disablePadding: false,
    label: i18n.t('user:lastName'),
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: i18n.t('user:email'),
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: i18n.t('common:createdAt'),
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(getUserUsersSelector);
  const count = useSelector(getUserCountSelector);

  const roles = useSelector(getRoleCurrentUserRolesSelector);

  const { t } = useTranslation();

  // delete a row
  const onDelete = useCallback(
    (user: IUser): void => {
      dispatch(deleteUserById(user.objectId, true));
    },
    [dispatch],
  );

  // go to preview page
  const onPreview = useCallback(
    (id: string): void => {
      navigate(goToUser(id));
    },
    [navigate],
  );

  // delete selected rows
  const handleDeleteSelected = async (ids: string[]): Promise<void | undefined> => {
    dispatch(deleteUsersById(ids));
  };

  const onUpdateData = (queries: IQueriesInput) => {
    dispatch(loadUsers(queries))
  }

  // table data
  const dataTable = useMemo((): Data[] => {
    const canDelete = canAccessTo(roles, '_User', 'delete');
    const canPreview = canAccessTo(roles, '_User', 'get');

    const usersData = users.map((user: IUser) => {
      // default data
      const data: Record<string, any> = {
        id: user.objectId,
        fullName: (
          <ListItem sx={{ p: 0 }}>
            <ListItemAvatar sx={{ mr: 2 }}>
              <Avatar user={user} size={36} sx={{ marginLeft: 'auto', marginRight: 0 }} />
            </ListItemAvatar>
            <ListItemText primary={user.lastName} secondary={user.firstName} />
          </ListItem>
        ),
        platform: user.platform ? capitalizeFirstLetter(user.platform) : '',
        email: user.username,
        createdAt: displayDate(user.createdAt, false, true),
        actions:(
          <ButtonActions
            onDelete={canDelete ? () => onDelete(user) : undefined}
            onPreview={canPreview ? () => onPreview(user.objectId) : undefined}
            value={getUserFullName(user)}
          />  
        )
      };

      return data as Data;
    });

    return usersData;
  }, [users, onDelete, onPreview, roles]);

  return (
    <>
      <Head title="Users" />
      <List
        onUpdateData={onUpdateData}
        items={dataTable}
        onDeleteSelected={handleDeleteSelected}
        headCells={headCells}
        count={count}
        canDelete={canAccessTo(roles, '_User', 'delete')}
        canUpdate={canAccessTo(roles, '_User', 'update')}
        renderFilter={(
          onSearch: (search: string) => void,
          onAdvancedSearch: (values: Record<string, any>) => void
        ) => (
          <>
            <SearchInput onChange={onSearch} placeholder={t('user:searchByNameOrEmail')} />
            <UserAdvancedFilterForm onSubmit={onAdvancedSearch} />
          </>
        )}
      />
    </>
  );
}

export default Users;
