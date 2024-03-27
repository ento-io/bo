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
import { IMenu } from '@/types/app.type';

interface Props {
  numSelected: number;
  onDeleteSelected: (() => void) | undefined;
  onMarkAsSeenSelected: (() => void) | undefined;
  menus?: IMenu[];
}

const TableToolbar = ({ numSelected, onDeleteSelected, onMarkAsSeenSelected, menus = [] }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { open: openDeleteModal, toggle: toggleDeleteModal } = useToggle();

  if (numSelected <= 0) {
    return null;
  }

  const handleDelete = () => {
    onDeleteSelected?.();
  };

  const options = [
    ...menus, // before delete
    {
      onClick: onMarkAsSeenSelected,
      display: !!onMarkAsSeenSelected,
      label: t('markAsSeen'),
      icon: <FaTasks size={20} />
    },
    {
      onClick: toggleDeleteModal,
      display: !!onDeleteSelected,
      label: t('delete'),
      icon: <FaTrashAlt size={20} color={theme.palette.error.main} />
    },
  ];

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
          {options.map((option, index) => (
            option.display && (
              <Tooltip title={option.label} key={index}>
                <IconButton onClick={option.onClick}>
                  {option.icon}
                </IconButton>
              </Tooltip>
            )
          ))}
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
