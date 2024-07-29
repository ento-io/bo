import { MouseEvent, useState } from 'react';

import { Theme } from '@emotion/react';
import { alpha, Button, Typography, useTheme } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { FiChevronDown, FiEdit3, FiEye, FiList, FiPlus, FiSend, FiTrash } from 'react-icons/fi';

import { useToggle } from '@/hooks/useToggle';

import Dialog from './Dialog';
import { IMenu } from '@/types/app.type';

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

export type ActionsMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  goToList?: () => void;
  onCreate?: () => void;
  onPreview?: () => void;
  onSendInvoice?: () => void;
  label?: string;
  className?: string;
  menus?: IMenu[];
};

const ActionsMenu = ({
  onEdit,
  onDelete,
  goToList,
  onPreview,
  onCreate,
  onSendInvoice,
  label,
  className,
  menus = []
}: ActionsMenuProps) => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();

  const theme = useTheme();
  const { open: openDeleteDialog, toggle: toggleDeleteDialog } = useToggle();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    toggleDeleteDialog();
  };

  const handleSendInvoice =  (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!onSendInvoice) return;
    onSendInvoice();
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

  const options = [
    {
      onClick: handleEdit,
      display: !!onEdit,
      label: t('edit'),
      icon: <FiEdit3 size={20} />
    },
    {
      onClick: handlePreview,
      display: !!onPreview,
      label: t('seePreview'),
      icon: <FiEye size={20} />
    },
    {
      onClick: goToList,
      display: !!goToList,
      label: t('returnToList'),
      icon: <FiList size={20} />
    },
    {
      onClick: handleSendInvoice,
      display: !!onSendInvoice,
      label: t('user:sendInvoice'),
      icon: <FiSend size={20} />
    },
    {
      onClick: onCreate,
      display: !!onCreate,
      label: t('add'),
      icon: <FiPlus size={20} />
    },
    ...menus, // before delete
    {
      onClick: handleDelete,
      display: !!onDelete,
      label: t('delete'),
      icon: <FiTrash size={20} css={(theme: Theme) => ({ color: theme.palette.error.main})} />
    },
  ];

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
          {options.map((option, index) => (
            option.display && (
              <MenuItem onClick={option.onClick} key={index}>
                <ListItemIcon>
                  {option.icon}
                </ListItemIcon>
                {option.label}
              </MenuItem>
            )
          ))}
      </Menu>

      {/* ---------- delete confirmation modal */}
      <Dialog
        title={t('deletion')}
        description={label && onDelete ? t('sureToDelete', { value: label }) : ''}
        toggle={toggleDeleteDialog}
        open={openDeleteDialog}
        onPrimaryButtonAction={onDelete}
        maxWidth="xs"
        onClick={handleConfirmDeleteDialogClick}
      />
    </div>
  );
};

export default ActionsMenu;
