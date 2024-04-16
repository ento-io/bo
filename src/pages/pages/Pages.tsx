import { ReactNode, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { getPageCountSelector, getPagePagesSelector } from '@/redux/reducers/page.reducer';
import { deletePage, goToAddPage, goToPage, goToEditPage, loadPages, togglePagesByIds } from '@/redux/actions/page.action';
import List from '@/components/table/List';
import { displayDate } from '@/utils/date.utils';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IQueriesInput, IRenderSearchProps, TableHeadCell } from '@/types/app.type';
import ButtonActions from '@/components/ButtonActions';
import Head from '@/components/Head';
import { pagesRoute } from '@/routes/protected/page.routes';
import { IPage, IPageTranslatedFields } from '@/types/page.type';
import AddFab from '@/components/AddFab';
import SearchPages from '@/containers/pages/SearchPages';
import { pagesTabOptions, getTranslatedCategoriesName } from '@/utils/cms.utils';
import { isRecycleBinTab } from '@/utils/app.utils';
import { getSettingsLangSelector } from '@/redux/reducers/settings.reducer';
import { getTranslatedField } from '@/utils/settings.utils';
import UserCell from '@/components/UserCell';

interface Data {
  title: string;
  categories: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  actions: ReactNode;
}

const headCells: TableHeadCell<keyof Data>[] = [
  {
    id: 'title',
    label: i18n.t('cms:title'),
  },
  {
    id: 'categories',
    label: i18n.t('cms:category.categories'),
  },
  {
    id: 'user',
    label: i18n.t('cms:author'),
    align: 'left',
  },
  {
    id: 'createdAt',
    label: i18n.t('common:createdAt'),
    align: 'right',
  },
  {
    id: 'updatedAt',
    label: i18n.t('common:updatedAt'),
    align: 'right',
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'right',
  },
];

const Pages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pages = useSelector(getPagePagesSelector);
  const language = useSelector(getSettingsLangSelector);

  const count = useSelector(getPageCountSelector);
  const searchParams = pagesRoute.useSearch();

  const roles = useSelector(getRoleCurrentUserRolesSelector);
  const canCreate = canAccessTo(roles, 'Page', 'create');

  const canDestroy = searchParams.tab && isRecycleBinTab(searchParams.tab);

  // delete a row
  const onDelete = useCallback(
    (page: IPage): void => {
      dispatch(deletePage(page.objectId));
    },
    [dispatch],
  );

  // go to preview page
  const onPreview = useCallback(
    (id: string): void => {
      navigate(goToPage(id));
    },
    [navigate],
  );

  const onEdit = useCallback(
    (page: IPage): void => {
      navigate(goToEditPage(page.objectId));
    },
    [navigate],
  );

  const onCreate = (): void => {
    navigate(goToAddPage());
  }

  // delete selected rows
  const handleDeleteSelected = async (ids: string[]): Promise<void | undefined> => {
    dispatch(togglePagesByIds(ids, 'deleted', false));
  };

  const onUpdateData = (queries: IQueriesInput) => {
    // the on tab change is not used here, we use it in on page enter with search params
    dispatch(loadPages(queries));
  }

  // table data
  const dataTable = useMemo((): Data[] => {
    const canDelete = canAccessTo(roles, 'Page', 'delete');
    const canPreview = canAccessTo(roles, 'Page', 'get');
    const canEdit = canAccessTo(roles, 'Page', 'update');

    const pagesData = pages.map((page: IPage) => {
      const title = getTranslatedField<IPageTranslatedFields>(page.translated, language, 'title')
      // default data
      const data: Record<string, any> = {
        id: page.objectId, // required even if not displayed
        title,
        categories: getTranslatedCategoriesName(page.categories, language),
        user: <UserCell user={page.user} />,
        createdAt: displayDate(page.createdAt, false, true),
        updatedAt: displayDate(page.updatedAt, false, true),
        actions: canDestroy
          ? null
          : (
              <ButtonActions
                onDelete={canDelete ? () => onDelete(page) : undefined}
                onPreview={canPreview ? () => onPreview(page.objectId) : undefined}
                onEdit={canEdit ? () => onEdit(page) : undefined}
                value={page.reference}
              />
            )
          };

      return data as Data;
    });

    return pagesData;
  }, [pages, onDelete, onPreview, roles, onEdit, canDestroy, language]);

  return (
    <>
      <Head title="Pages" />
      <List
        tabs={pagesTabOptions}
        // @see pages.routes.tsx for search params definition
        defaultFilters={searchParams}
        enableMultipleSelect={!canDestroy}
        onUpdateData={onUpdateData}
        items={dataTable}
        onDeleteSelected={handleDeleteSelected}
        headCells={headCells}
        count={count}
        canDelete={canAccessTo(roles, 'Page', 'delete')}
        canUpdate={canAccessTo(roles, 'Page', 'update')}
        renderFilter={(prop: IRenderSearchProps) => <SearchPages {...prop} />}
      />

      {canCreate && (
        <AddFab onClick={onCreate} />
      )}
    </>
  );
}

export default Pages;
