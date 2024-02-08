import { MouseEvent, ReactNode, useState } from 'react';

import { Theme } from '@emotion/react';
import { alpha, Button, Typography, useTheme } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { FaCheckDouble } from 'react-icons/fa';
import { FiChevronDown, FiEdit3, FiEye, FiList, FiPlus, FiTrash } from 'react-icons/fi';

import { useToggle } from '@/hooks/useToggle';

import Dialog from './Dialog';

const classes = {
  menu: (theme: Theme) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        },
      },
    },
  }),
  button: (theme: Theme) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.paper,
    border: theme.palette.mode === 'light' ? '1px solid #dddddf' : 'none',
    color: '#1B191F',
    transition: 'all 0.08s ease-in-out !important',
    borderRadius: 6,
    height: 42,
    padding: '0 25px',
    '& .MuiTypography-root': {
      fontWeight: 700,
    },
  }),
};

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  goToList?: () => void;
  onMarkAsSeen?: () => void;
  onCreate?: () => void;
  onPreview?: () => void;
  label?: string;
  children?: ReactNode;
  className?: string;
};

const ActionsMenu = ({
  onEdit,
  onDelete,
  goToList,
  onMarkAsSeen,
  onPreview,
  onCreate,
  label,
  className,
  children,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const theme = useTheme();
  const { open: openDeleteDialog, toggle: toggleDeleteDialog } = useToggle();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={className}>
      {/* -------- button -------- */}
      <div className="flexRow justifyCenter center textCenter">
        <Button
          css={classes.button}
          endIcon={<FiChevronDown color={theme.palette.mode === 'light' ? '#000' : '#fff'} />}
          onClick={handleClick}>
          <Typography sx={{ fontSize: 16, textTransform: 'none', px: 0 }}>Actions</Typography>
        </Button>
      </div>
      {/* -------- menu -------- */}
      <Menu
        elevation={0}
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock
        css={classes.menu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        {onEdit && (
          <MenuItem onClick={onEdit}>
            <ListItemIcon>
              <FiEdit3 size={20} />
            </ListItemIcon>
            {t('edit')}
          </MenuItem>
        )}

        {onPreview && (
          <MenuItem onClick={onPreview}>
            <ListItemIcon>
              <FiEye size={20} />
            </ListItemIcon>
            {t('seePreview')}
          </MenuItem>
        )}

        {goToList && (
          <MenuItem onClick={goToList}>
            <ListItemIcon>
              <FiList size={20} />
            </ListItemIcon>
            {t('returnToList')}
          </MenuItem>
        )}

        {onCreate && (
          <MenuItem onClick={onCreate}>
            <ListItemIcon>
              <FiPlus size={20} />
            </ListItemIcon>
            {t('add')}
          </MenuItem>
        )}

        {onMarkAsSeen && (
          <MenuItem onClick={onMarkAsSeen}>
            <ListItemIcon>
              <FaCheckDouble size={20} />
            </ListItemIcon>
            {t('markAsSeen')}
          </MenuItem>
        )}

        {children}

        {onDelete && (
          <MenuItem onClick={toggleDeleteDialog}>
            <ListItemIcon>
              <FiTrash size={20} color={theme.palette.error.main} />
            </ListItemIcon>
            {t('delete')}
          </MenuItem>
        )}
      </Menu>

      {/* ---------- delete confirmation modal */}
      <Dialog
        title={t('deletion')}
        description={label && onDelete ? t('sureToDelete', { value: label }) : ''}
        toggle={toggleDeleteDialog}
        open={openDeleteDialog}
        onPrimaryButtonAction={onDelete}
        maxWidth="xs"
      />
    </div>
  );
};

export default ActionsMenu;
