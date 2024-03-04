import { MouseEvent, ReactNode, useState } from 'react';

import { Box, IconButton, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FiEdit3, FiEye, FiTrash } from 'react-icons/fi';

import Dialog from './Dialog';

type Props = {
  onDelete?: () => void;
  onEdit?: () => void;
  onPreview?: () => void;
  value?: any;
  dialogDescription?: string | null;
  children?: ReactNode;
  withDeletionModal?: boolean;
};
const ButtonActions = ({
  onDelete,
  onEdit,
  onPreview,
  value,
  dialogDescription,
  children,
  withDeletionModal = true,
}: Props) => {
  const { t } = useTranslation();

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);

  const handleDelete = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (withDeletionModal) {
      toggleDeleteModal();
      return;
    }
    onDelete?.();
  };

  const handleEdit = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!onEdit) return;
    onEdit();
  };

  const handlePreview = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!onPreview) return;
    onPreview();
  };

  const handleConfirmDeleteDialogClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Stack direction="row" spacing={1}>
        {onPreview && (
          <IconButton aria-label="preview" onClick={handlePreview}>
            <FiEye size={20} />
          </IconButton>
        )}
        {onEdit && (
          <IconButton aria-label="edit" onClick={handleEdit}>
            <FiEdit3 size={20} />
          </IconButton>
        )}
        {onDelete && (
          <IconButton aria-label="delete" onClick={handleDelete} color="error">
            <FiTrash size={20} />
          </IconButton>
        )}
        {children}
      </Stack>

      {/* ---------- delete confirmation modal */}
      <Dialog
        title={t('delete')}
        description={dialogDescription ?? t('sureToDelete', { value })}
        toggle={toggleDeleteModal}
        open={openDeleteModal}
        onPrimaryButtonAction={onDelete}
        maxWidth="xs"
        onClick={handleConfirmDeleteDialogClick}
      />
    </Box>
  );
};

export default ButtonActions;
