import { useState } from 'react';

import { Box, Button, TableFooter } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import AddFab from '@/components/AddFab';
import ButtonActions from '@/components/ButtonActions';
import Dialog from '@/components/Dialog';
import EmptyData from '@/components/EmptyData';
import ConfirmDeletionFormModalAction from '@/components/form/ConfirmDeletionFormModalAction';
import Layout from '@/components/layouts/Layout';

import { useToggle } from '@/hooks/useToggle';

import { createRole, destroyRole, loadRoles, updateRole } from '@/redux/actions/role.action';
import { getRoleRolesSelector } from '@/redux/reducers/role.reducer';

import { ROLE_DEFAULT_LIMIT } from '@/utils/constants';
import { displayDate } from '@/utils/date.utils';
import { lowerFirstLetter } from '@/utils/utils';

import { IRole, IRoleInput } from '@/types/role.type';

import RoleForm from '../containers/roles/RoleForm';

const ROLE_FORM_ID = 'role-form-id';

const sx = {
  tableHeadCell: {
    color: '#fff',
  },
};

const Roles = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'user']);
  const roles = useSelector(getRoleRolesSelector);
  const { open: openAddFormDialog, toggle: toggleAddFormDialog } = useToggle();
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [page, setPage] = useState<number>(0);

  const clearSelectedRole = () => setSelectedRole(null);

  const onRoleFormSubmit = async (values: IRoleInput) => {
    if (selectedRole) {
      await dispatch(updateRole(selectedRole.name, values));
      clearSelectedRole();
      return;
    }
    await dispatch(createRole(values));
    toggleAddFormDialog();
  };

  const handleDelete = (role: IRole) => {
    dispatch(destroyRole(role.objectId));
  };

  const onLoadMode = () => {
    setPage((prev: number) => prev + 1);
    const values = {
      withAdminOrBetter: false,
      withUsersCount: true,
      skip: ROLE_DEFAULT_LIMIT * (page + 1),
      incrementItems: true,
    };
    dispatch(loadRoles(values));
  };

  return (
    <Layout title={t('user:role.roles')}>
      {roles?.length === 0 ? (
        <EmptyData />
      ) : (
        <TableContainer>
          <Table aria-label="table">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={sx.tableHeadCell}>{t('common:name')}</TableCell>
                <TableCell sx={sx.tableHeadCell}>{t('common:createdAt')}</TableCell>
                <TableCell sx={sx.tableHeadCell}>{t('user:numberOfUsers')}</TableCell>
                <TableCell sx={sx.tableHeadCell} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role, index) => (
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={role.name + index}>
                  <TableCell scope="row">{role.name}</TableCell>
                  <TableCell scope="row">{displayDate(role.createdAt, false, true)}</TableCell>
                  <TableCell scope="row">{role.count || 0}</TableCell>
                  <TableCell scope="row">
                    <ButtonActions
                      onDelete={role.count < 1 ? () => handleDelete(role) : undefined}
                      onEdit={() => setSelectedRole(role)}
                      value={role.name}
                      dialogDescription={
                        role.count > 0
                          ? t('user:role.sureToDeleteRoleWithUsers', { name: role.name, userCount: role.count })
                          : null
                      }>
                      {role.count > 0 && (
                        <ConfirmDeletionFormModalAction
                          value={role.name}
                          onConfirmed={() => handleDelete(role)}
                          label={lowerFirstLetter(t('user:role.thisRole'))}
                          type={t('user:role.theRoleName')}
                        />
                      )}
                    </ButtonActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter />
          </Table>
          <Box className="flexRow flex1 justifyEnd" mt={2}>
            <Button onClick={onLoadMode} sx={{ textTransform: 'inherit', fontSize: 16 }} variant="contained">
              {t('common:loadMore')}
            </Button>
          </Box>
        </TableContainer>
      )}

      <AddFab onClick={toggleAddFormDialog} />

      <Dialog
        fullScreen
        title={selectedRole ? t('user:role.editRole', { role: selectedRole.name }) : t('user:role.addRole')}
        open={selectedRole ? !!selectedRole : openAddFormDialog}
        toggle={selectedRole ? clearSelectedRole : toggleAddFormDialog}
        formId={ROLE_FORM_ID}>
        <RoleForm formId={ROLE_FORM_ID} onSubmit={onRoleFormSubmit} selectedRole={selectedRole} roles={roles} />
      </Dialog>
    </Layout>
  );
};

export default Roles;
