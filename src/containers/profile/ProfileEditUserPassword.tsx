import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import { FiEdit } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

import Dialog from '@/components/Dialog';

import { changePassword } from '@/redux/actions/auth.action';

import ProfileUserPasswordForm from './ProfileUserPasswordForm';
import { IChangePasswordInput } from '@/types/auth.type';

const USER_PASSWORD_FORM_ID = 'user-password-form-id';

const ProfileEditUserPassword = () => {
  const [isOpenEditUserPasswordDialog, setIsOpenEditUserPasswordDialog] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const toggleOpenEditUserPasswordFormDialog = () => {
    setIsOpenEditUserPasswordDialog(!isOpenEditUserPasswordDialog);
  };

  const onUSerPasswordFormSubmit = (values: IChangePasswordInput) => {
    dispatch(changePassword(values));
    toggleOpenEditUserPasswordFormDialog();
  };

  return (
    <>
      <IconButton size="small" onClick={toggleOpenEditUserPasswordFormDialog}>
        <FiEdit />
      </IconButton>
      <Dialog
        maxWidth="sm"
        fullWidth
        title={t('user:changePassword')}
        open={isOpenEditUserPasswordDialog}
        toggle={toggleOpenEditUserPasswordFormDialog}
        formId={USER_PASSWORD_FORM_ID}>
        <ProfileUserPasswordForm formId={USER_PASSWORD_FORM_ID} onSubmit={onUSerPasswordFormSubmit} />
      </Dialog>
    </>
  );
};

export default ProfileEditUserPassword;
