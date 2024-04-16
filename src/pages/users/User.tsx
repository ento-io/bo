import { Box, Button, Chip, Stack, Theme, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { FiCheck, FiPlus } from 'react-icons/fi';
import { IoWarning } from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { FaCertificate } from "react-icons/fa6";
import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import ActionsMenu from '@/components/ActionsMenu';
import BooleanIcons from '@/components/BooleanIcons';
import Dialog from '@/components/Dialog';
import SendEmailFab from '@/components/EmailFab';
import Head from '@/components/Head';
import Items from '@/components/Items';
import ItemsStatus from '@/components/ItemsStatus';
import Layout from '@/components/layouts/Layout';

import RoleForUserForm from '@/containers/roles/RoleForUserForm';

import { useToggle } from '@/hooks/useToggle';

import { addRolesToUser, removeRolesForUser } from '@/redux/actions/role.action';
import { goToUsers, sendEmailToUser, toggleBanUserById, toggleUserNotification } from '@/redux/actions/user.action';
import { getRoleUserRolesSelector } from '@/redux/reducers/role.reducer';
import { getUserUserSelector } from '@/redux/reducers/user.reducer';

import { PREVIEW_PAGE_GRID } from '@/utils/constants';
import { displayDate, getAgeByBirthday } from '@/utils/date.utils';
import { getFullPhoneNumber, getSexLabelByValue, getUserFullName, isUserFromBO } from '@/utils/user.utils';

import { ISelectOption } from '@/types/app.type';
import { IRole, RolesForUserInput } from '@/types/role.type';
import { SendEmailInput } from '@/types/user.type';
import RolesChip from '@/containers/users/RolesChip';
import SendEmailForm from '@/containers/users/SendEmailForm';
import UserInfo from '@/containers/users/UserInfos';

const ADD_ROLE_USER_FORM_ID = 'add-role-form-id';
const SEND_EMAIL_TO_USER_FORM_ID = 'send-email-to-user-form-id';

const User = () => {
  const { t } = useTranslation(['common', 'user']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUserUserSelector);
  const roles = useSelector(getRoleUserRolesSelector);
  const { open: openAddRoleToUser, toggle: toggleOpenAddRoleToUser } = useToggle();
  const { open: isOpenEmailDialog, toggle: toggleOpenEmailFormDialog } = useToggle();

  if (!user) return null;

  const userFullName = getUserFullName(user);

  const infosItems: ISelectOption[] = [
    {
      label: t('user:firstName'),
      value: user.firstName,
    },
    {
      label: t('user:lastName'),
      value: user.lastName,
    },
    {
      label: t('common:createdAt'),
      value: displayDate(user.createdAt),
    },
    {
      label: t('common:updatedAt'),
      value: displayDate(user.updatedAt),
    },
    {
      label: t('common:deletedAt'),
      value: displayDate(user.deletedAt),
      hide: !user.deletedAt
    },
    {
      label: t('user:sex'),
      value: user.sex ? getSexLabelByValue(user.sex) : user.sex,
    },
    {
      label: t('user:aboutTheUser'),
      value: user.aboutMe,
    },
    {
      label: t('user:birthday'),
      value: user.birthday
        ? `${displayDate((user.birthday as any).iso, false)} (${getAgeByBirthday((user.birthday as any).iso)})`
        : '',
    },
    {
      label: t('common:platform'),
      value: user.platform,
    },
  ];

  const contactItems: ISelectOption[] = [
    {
      label: t('user:email'),
      value: user.username,
    },
    {
      label: t('user:phoneNumber'),
      value: user.phone ? getFullPhoneNumber(user.phone) : '',
    },
    {
      label: t('user:address'),
      value: user.address,
    },
  ];

  const statusItems: ISelectOption<ReactNode>[] = [
    {
      label: t('user:banned'),
      value: <BooleanIcons value={!!user.banned} />,
    },
    {
      label: t('user:accountVerified'),
      value: <BooleanIcons value={!!user.verified} />,
    },
  ];

  const handleGoToList = () => {
    navigate(goToUsers())
  };

  const toggleBanUser = () => {
    dispatch(toggleBanUserById(user.objectId, !user.banned));
  };

  // for notification
  const handleMarkAsSeen = () => {
    dispatch(toggleUserNotification(user.objectId));
  };

  const onSubmitRoles = (values: RolesForUserInput) => {
    dispatch(addRolesToUser(user.objectId, values));
    toggleOpenAddRoleToUser();
  };

  const onSendEmailFormSubmit = async (values: SendEmailInput) => {
    await dispatch(sendEmailToUser(user, values));
    toggleOpenEmailFormDialog();
  };

  const handleRemoveRoleForUser = (role: IRole) => {
    dispatch(removeRolesForUser(user.objectId, [role]));
  };

  const menus = [
    {
      onClick: toggleBanUser,
      display: true,
      label: user.banned ? t('common:activate') : t('user:ban'),
      icon: user.banned
        ? <FiCheck css={(theme: Theme) => ({ color: theme.palette.success.main })} />
        : <IoWarning css={(theme: Theme) => ({ color: theme.palette.error.main })} />
    },
    {
      onClick: handleMarkAsSeen,
      display: true,
      label: user.seen ? t('markAsUnseen') : t('markAsSeen'),
      icon: user.seen ? <FaCheck /> : <FaCheckDouble />
    },
  ];

  return (
    <Layout
      title={(
        <>
          <span css={{ marginRight: 10 }}>{t('user:user')}</span>
          <span> - </span>
          <span>{user.lastName}</span>
          <Tooltip title={t('user:accountVerified')}>
            <FaCertificate size={16} css={(theme: Theme) => ({ color: theme.palette.info.main, marginLeft: 10 })} />
          </Tooltip>
        </>
      )}
      isCard={false}
      actions={
        <ActionsMenu
          label={user.lastName}
          goToList={handleGoToList}
          menus={menus}
        />
      }>
      <Head title={t('user:user')} />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        <Grid item {...PREVIEW_PAGE_GRID.left}>
          <Stack spacing={3}>
            <Layout cardTitle={t('common:details')}>
              <Items items={infosItems} />
            </Layout>
            <Layout cardTitle={t('user:contact')}>
              <Items items={contactItems} />
            </Layout>
          </Stack>
        </Grid>

        <Grid item {...PREVIEW_PAGE_GRID.right}>
          <Stack spacing={3}>
            <Layout>
              <UserInfo user={user} />
            </Layout>

            {/* show add or edit role only for user created from BO */}
            {isUserFromBO(user) && (
              <Layout cardTitle={t('user:role.roles')}>
                {roles.length > 0 ? (
                  <Stack spacing={1} direction="row">
                    <RolesChip roles={roles} onRemove={handleRemoveRoleForUser} />
                    <Chip label="+" color="primary" sx={{ fontSize: 22 }} onClick={toggleOpenAddRoleToUser} />
                  </Stack>
                ): (
                  <div css={{ marginTop: 2 }}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="textSecondary">
                        {t('user:role.userHasNotPost')}
                      </Typography>
                      <Button onClick={toggleOpenAddRoleToUser} startIcon={<FiPlus />} size="small">
                        {t('user:role.addPost')}
                      </Button>
                    </Stack>
                  </div>
                )}
              </Layout>
            )}

            <Layout cardTitle="Status">
              <ItemsStatus items={statusItems} entity={user} />
            </Layout>
          </Stack>
        </Grid>
      </Grid>

      <SendEmailFab onClick={toggleOpenEmailFormDialog} />

      <Dialog
        maxWidth="sm"
        fullWidth
        title={t('user:sendEmailTo', { name: userFullName })}
        open={isOpenEmailDialog}
        toggle={toggleOpenEmailFormDialog}
        formId={SEND_EMAIL_TO_USER_FORM_ID}
        primaryButtonText={t('send')}>
        <SendEmailForm
          formId={SEND_EMAIL_TO_USER_FORM_ID}
          onSubmit={onSendEmailFormSubmit}
          initialValues={{ email: user.email }}
        />
      </Dialog>

      <Dialog
        maxWidth="sm"
        fullWidth
        title={t('user:role.addRolesForThisUser')}
        open={openAddRoleToUser}
        toggle={toggleOpenAddRoleToUser}
        formId={ADD_ROLE_USER_FORM_ID}>
        <Box sx={{ mt: 2 }}>
          <RoleForUserForm onSubmit={onSubmitRoles} userRoles={roles} formId={ADD_ROLE_USER_FORM_ID} />
        </Box>
      </Dialog>
    </Layout>
  );
};

export default User;
