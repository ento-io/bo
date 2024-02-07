import { IconButton } from '@mui/material';
import { FiTrash } from 'react-icons/fi';

import { useToggle } from '@/hooks/useToggle';

import ConfirmDeletionFormModal from './ConfirmDeletionFormModal';

type Props = {
  value: string;
  onConfirmed: () => void;
  label: string;
  type: string;
};

const ConfirmDeletionFormModalAction = ({ value, onConfirmed, label, type }: Props) => {
  const { open: IsOpenConfirmDeleteModal, toggle: toggleOpenConfirmDeleteModal } = useToggle();

  return (
    <>
      <IconButton aria-label="delete" onClick={toggleOpenConfirmDeleteModal} color="error">
        <FiTrash size={20} />
      </IconButton>
      <ConfirmDeletionFormModal
        toggle={toggleOpenConfirmDeleteModal}
        label={label}
        type={type}
        value={value}
        onConfirmed={onConfirmed}
        open={IsOpenConfirmDeleteModal}
      />
    </>
  );
};

export default ConfirmDeletionFormModalAction;
