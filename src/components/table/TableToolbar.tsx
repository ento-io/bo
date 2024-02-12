import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { FaTasks, FaTrashAlt } from 'react-icons/fa';

import Dialog from '@/components/Dialog';

import { useToggle } from '@/hooks/useToggle';

interface Props {
  numSelected: number;
  onDeleteSelected: (() => void) | undefined;
  onMarkAsSeenSelected: (() => void) | undefined;
}

const TableToolbar = ({ numSelected, onDeleteSelected, onMarkAsSeenSelected }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { open: openDeleteModal, toggle: toggleDeleteModal } = useToggle();

  if (numSelected <= 0) {
    return null;
  }

  const handleDelete = () => {
    onDeleteSelected?.();
  };

  return (
    <>
      <Toolbar
        sx={{
          borderRadius: 1,
          mb: 2,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}>
        {/* label with count */}
        <Typography sx={{ flex: '1 1 100%' }} variant="subtitle1">
          {t('selectedCount', { count: numSelected })}
        </Typography>
        <Stack direction="row" spacing={2}>
          {/* mark as seen icon */}
          {onMarkAsSeenSelected && (
            <Tooltip title={t('markAsSeen')}>
              <IconButton onClick={onMarkAsSeenSelected}>
                <FaTasks color={theme.palette.success.main} />
              </IconButton>
            </Tooltip>
          )}
          {/* delete icon */}
          {onDeleteSelected && (
            <Tooltip title={t('delete')}>
              <IconButton onClick={toggleDeleteModal}>
                <FaTrashAlt color={theme.palette.error.main} size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Toolbar>
      {/* ---------- delete confirmation modal */}
      <Dialog
        title={t('delete')}
        description={t('sureToDeleteSelected', { count: numSelected })}
        toggle={toggleDeleteModal}
        open={openDeleteModal}
        onPrimaryButtonAction={handleDelete}
        maxWidth="xs"
      />
    </>
  );
};

export default TableToolbar;
