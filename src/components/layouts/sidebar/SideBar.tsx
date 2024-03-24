import { Fragment, ReactNode, useState } from 'react';

import { Collapse, ListSubheader } from '@mui/material';
import { grey } from '@mui/material/colors';
import List from '@mui/material/List';
import { useTranslation } from 'react-i18next';
import { FaLockOpen } from 'react-icons/fa';
import { FiChevronRight, FiChevronUp, FiClipboard, FiHome, FiSettings, FiUsers , FiCloudSnow, FiPrinter} from 'react-icons/fi';

import { useNavigate, useRouterState , RouterState } from '@tanstack/react-router';
import { canAccessTo } from '@/utils/role.utils';
import { IRole } from '@/types/role.type';
import SideBarItem from './SideBarItem';
import { PATH_NAMES } from '@/utils/pathnames';
import { goToUsers } from '@/redux/actions/user.action';
import { goToRoles } from '@/redux/actions/role.action';
import { goToSettings } from '@/redux/actions/app.action';
import { goToArticles } from '@/redux/actions/article.action';
import { goToEstimates } from '@/redux/actions/estimate.action';
import { goToInvoices } from '@/redux/actions/invoice.action';

const TEXT_COLOR = grey[700];
/**
 * mark list as selected if the current route is match the list id
 * @param {RouterState['location']} location
 * @param {string} id
 * @returns
 */
const isSelected = (location: RouterState['location'], id: string, pathPosition = 0): boolean => {
  const isHome = location.pathname === '/';
  // the home url is exceptionnal since it's just /
  if (id === 'home') {
    return isHome;
  }

  // ex: /recycle-bin/contacts => recycle-
  const splittedPathnames = location.pathname.split('/');
  const pathnames = splittedPathnames.filter((path: string) => path);
  // ex: /articles/categories => /categories (position: 2)
  // ex: /articles => /articles
  const firstPathname = pathnames.length > 2 ? pathnames[pathnames.length - 1] : pathnames[pathPosition];

  if (!firstPathname) return false;

  return id.includes(firstPathname);
};

export interface ISubMenu {
  id: string;
  label: string;
  onClick: () => void;
  icon: ReactNode;
  className?: string;
  notification?: number;
  pathnamePosition?: number;
  subMenus?: ISubMenu[];
}

interface IMenu {
  title: string;
  subMenus: ISubMenu[];
}

const sx = {
  itemText: {
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 1.5,
    fontWeight: 400,
    color: TEXT_COLOR,
  },
  subMenuHeader: {
    lineHeight: 1.57,
    fontWeight: 500,
    opacity: 0.8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    mt: 2.4,
    mb: 1.5,
  },
};

const ICON_SIZE = 20;
// const SUBMENU_ICON_SIZE = 16;

type Props = {
  open: boolean;
  roles: IRole[];
  onClose: () => void;
};

const SideBar = ({ open, roles, onClose }: Props) => {
  const { t } = useTranslation(['common', 'route', 'user']);
  const { location } = useRouterState();
  const navigate = useNavigate();

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [openSubMenu, setOpenSubMenu] = useState<boolean>(false);

  // const toggleOpenSubMenu = () => setOpenSubMenu(!openSubMenu);

  const renderRightIcon = (withSubMenus: boolean, openSubMenu: boolean): ReactNode | null => {
    if (!withSubMenus) return null;
    if (openSubMenu) return <FiChevronUp />;
    return <FiChevronRight />;
  }

  const menus: IMenu[] = [
    {
      title: t('common:dashboard'),
      subMenus: [
        {
          id: 'home',
          label: t('common:home'),
          onClick: () => navigate({ to: '/' }),
          icon: <FiHome size={ICON_SIZE} />,
        },
      ],
    },
    {
      title: 'Apps',
      subMenus: [
        {
          id: PATH_NAMES.users,
          label: t('user:users'),
          onClick: () => navigate(goToUsers()),
          icon: <FiUsers size={ICON_SIZE} />,
          className: '_User',
        },
        {
          id: PATH_NAMES.articles,
          label: t('common:article.articles'),
          onClick: () => navigate(goToArticles()),
          icon: <FiClipboard size={ICON_SIZE} />,
          className: 'Article',
        },
        {
          id: PATH_NAMES.estimates,
          label: t('common:estimates.estimate'),
          onClick: () => navigate(goToEstimates()),
          icon: <FiCloudSnow size={ICON_SIZE} />,
          className: 'Estimate',
        },
        {
          id: PATH_NAMES.invoices,
          label: t('common:invoices.invoice'),
          onClick: () => navigate(goToInvoices()),
          icon: <FiPrinter size={ICON_SIZE} />,
          className: 'Invoice',
        },
      ],
    },
    {
      title: t('common:settings'),
      subMenus: [
        {
          id: PATH_NAMES.roles,
          label: t('user:role.rights'),
          onClick: () => navigate(goToRoles()),
          icon: <FaLockOpen size={ICON_SIZE} />,
          className: '_Role',
        },
        {
          id: PATH_NAMES.settings,
          label: t('common:settings'),
          onClick: () => navigate(goToSettings()),
          icon: <FiSettings size={ICON_SIZE} />,
        },
      ],
    },
  ];

  return (
    <List sx={{ p: 0 }}>
      {menus.map((menu, index) => (
        <List
          key={index}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader" sx={sx.subMenuHeader}>
              {open ? menu.title : ''}
            </ListSubheader>
          }>
          {menu.subMenus.map((subMenu: ISubMenu, subMenuIndex: number) => (
            // not display if no find right for current user
            <Fragment key={subMenu.label + subMenuIndex}>
              {canAccessTo(roles, subMenu.className, 'find') ? (
                <>
                  <SideBarItem
                    subMenu={subMenu}
                    open={open}
                    isSelected={isSelected(location, subMenu.id, subMenu.pathnamePosition)}
                    rightIcon={renderRightIcon(!!subMenu.subMenus, openSubMenu)}
                    onClose={onClose}
                  />
                  {subMenu.subMenus?.map((subMenu2: ISubMenu, subMenu2Index: number) => (
                    <Collapse in={openSubMenu} timeout="auto" unmountOnExit key={subMenu2.label + subMenu2Index}>
                      <List component="div" disablePadding>
                        <SideBarItem
                          subMenu={subMenu2}
                          open={open}
                          isLevel2
                          isSelected={isSelected(location, subMenu2.id, subMenu2.pathnamePosition)}
                          onClose={onClose}
                        />
                      </List>
                    </Collapse>
                  ))}
                </>
              ) : null}
            </Fragment>
          ))}
        </List>
      ))}
    </List>
  );
};

export default SideBar;
