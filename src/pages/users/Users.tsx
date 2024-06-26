import { IconButton, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { FiSend } from 'react-icons/fi';

import { ReactNode, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { getUserCountSelector, getUserFiltersSelector, getUserUsersSelector } from '@/redux/reducers/user.reducer';
import { IUser, IUsersRouteSearchParams, PlatformEnum, SendEmailInput } from '@/types/user.type';
import { deleteUserById, deleteUsersById, goToUser, loadUsers, sendEmailToUser } from '@/redux/actions/user.action';
import List from '@/components/table/List';
import { displayDate } from '@/utils/date.utils';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IQueriesInput, IRenderSearchProps, TableHeadCell } from '@/types/app.type';
import Avatar from '@/components/Avatar';
import ButtonActions from '@/components/ButtonActions';
import { getUserFullName, usersTabOptions } from '@/utils/user.utils';
import Head from '@/components/Head';
import SearchInput from '@/components/form/inputs/SearchInput';
import UserAdvancedFilterForm from '@/containers/users/UserAdvancedFilterForm';
import { usersRoute } from '@/routes/protected/users.routes';
import Dialog from '@/components/Dialog';
import SendEmailForm from '@/containers/users/SendEmailForm';
import { isRecycleBinTab } from '@/utils/app.utils';
import BooleanIcons from '@/components/BooleanIcons';

const SEND_EMAIL_TO_USER_FORM_ID = 'send-email-form-id'

interface Data {
  id: string;
  fullName: string;
  email: string;
  createdAt: ReactNode;
  actions: ReactNode;
  verified: ReactNode;
}

const headCells: TableHeadCell<keyof Data>[] = [
  {
    id: 'fullName',
    label: i18n.t('user:fullName'),
  },
  {
    id: 'email',
    label: i18n.t('user:email'),
    align: 'center',
  },
  {
    id: 'verified',
    label: i18n.t('user:accountVerified'),
    align: 'center',
  },
  {
    id: 'createdAt',
    align: 'right',
    label: i18n.t('common:createdAt'),
  },
  {
    id: 'actions',
    align: 'right',
    label: 'Actions',
  },
];

/**
 * parse search params to queries input
 */
const getDefaultFilters = (searchParams: IUsersRouteSearchParams) => {
  const values: Record<string, any> = {};

  if (searchParams.role) {
    values.roles = [searchParams.role];
  }
  if (searchParams.from) {
    values.fromBO = searchParams.from === PlatformEnum.BO;
  }

  values.tab = searchParams.tab;

  return values;
}

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector(getUserUsersSelector);
  const count = useSelector(getUserCountSelector);
  const filters = useSelector(getUserFiltersSelector);
  const searchParams = usersRoute.useSearch();

  const roles = useSelector(getRoleCurrentUserRolesSelector);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const { t } = useTranslation();

  const canDestroy = searchParams.tab && isRecycleBinTab(searchParams.tab);

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

  const handleCloseDialog = () => {
    setSelectedUser(null);
  };

  const handleSelectRow = (user: IUser) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    setSelectedUser(user);
  }

  const onSendEmailFormSubmit = async (values: SendEmailInput) => {
    if (!selectedUser) return;
    await dispatch(sendEmailToUser(selectedUser, values));
    handleCloseDialog();
  };

  const onUpdateData = (queries: IQueriesInput) => {
    const newQueries = { ...queries, filters: { ...filters, ...queries.filters } };
    dispatch(loadUsers(newQueries))
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
        email: user.username,
        verified: <BooleanIcons value={!!user.verified} />,
        createdAt: displayDate(user.createdAt, false, true),
        actions: canDestroy
          ? null
          : (
            <ButtonActions
              onDelete={canDelete ? () => onDelete(user) : undefined}
              onPreview={canPreview ? () => onPreview(user.objectId) : undefined}
              value={getUserFullName(user)}
            >
              <IconButton aria-label="sendMail" onClick={handleSelectRow(user)}>
                <FiSend size={20} />
              </IconButton>
            </ButtonActions>  
          )
      };

      return data as Data;
    });

    return usersData;
  }, [users, onDelete, onPreview, roles, canDestroy]);

  return (
    <>
      <Head title="Users" />
      <List
        tabs={usersTabOptions}
        enableMultipleSelect={!canDestroy}
        // @see users.routes.tsx for search params definition
        defaultFilters={getDefaultFilters(searchParams)}
        onUpdateData={onUpdateData}
        items={dataTable}
        onDeleteSelected={handleDeleteSelected}
        headCells={headCells}
        count={count}
        canDelete={canAccessTo(roles, '_User', 'delete')}
        canUpdate={canAccessTo(roles, '_User', 'update')}
        renderFilter={(props: IRenderSearchProps) => (
          <>
            <SearchInput onChange={props.onSearch} placeholder={t('user:searchByNameOrEmail')} />
            <UserAdvancedFilterForm onSubmit={props.onAdvancedSearch} />
          </>
        )}
      />
      <Dialog
        title={selectedUser ? t('user:sendEmailTo', {name: getUserFullName(selectedUser)}) : t('sendEmail')}
        open={!!selectedUser}
        toggle={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        formId={SEND_EMAIL_TO_USER_FORM_ID}
        primaryButtonText={t('send')}>
       {selectedUser && (
         <SendEmailForm
          formId={SEND_EMAIL_TO_USER_FORM_ID}
          onSubmit={onSendEmailFormSubmit}
          initialValues={{ email: selectedUser.email }}
        />
       )}
      </Dialog>
    </>
  );
}

export default Users;
