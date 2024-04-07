import { ReactNode, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { getArticleCountSelector, getArticleArticlesSelector } from '@/redux/reducers/article.reducer';
import { deleteArticle, goToAddArticle, goToArticle, goToEditArticle, loadArticles, toggleArticlesByIds } from '@/redux/actions/article.action';
import List from '@/components/table/List';
import { displayDate } from '@/utils/date.utils';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IQueriesInput, IRenderSearchProps, TableHeadCell } from '@/types/app.type';
import ButtonActions from '@/components/ButtonActions';
import Head from '@/components/Head';
import { articlesRoute } from '@/routes/protected/article.routes';
import { IArticle, ITranslatedFields } from '@/types/article.types';
import AddFab from '@/components/AddFab';
import SearchArticles from '@/containers/articles/SearchArticles';
import { articlesTabOptions } from '@/utils/cms.utils';
import { isRecycleBinTab } from '@/utils/app.utils';
import { getSettingsLangSelector } from '@/redux/reducers/settings.reducer';
import { getTranslatedField } from '@/utils/settings.utils';

interface Data {
  title: string;
  user: string;
  createdAt: ReactNode;
  actions: ReactNode;
}

const headCells: TableHeadCell<keyof Data>[] = [
  {
    id: 'title',
    label: i18n.t('cms:title'),
  },
  {
    id: 'createdAt',
    label: i18n.t('common:createdAt'),
    align: 'right',
  },
  {
    id: 'actions',
    label: 'Actions',
    align: 'right',
  },
];

const Articles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const articles = useSelector(getArticleArticlesSelector);
  const language = useSelector(getSettingsLangSelector);

  const count = useSelector(getArticleCountSelector);
  const searchParams = articlesRoute.useSearch();

  const roles = useSelector(getRoleCurrentUserRolesSelector);
  const canCreate = canAccessTo(roles, 'Article', 'create');

  const canDestroy = searchParams.tab && isRecycleBinTab(searchParams.tab);

  // delete a row
  const onDelete = useCallback(
    (article: IArticle): void => {
      dispatch(deleteArticle(article.objectId));
    },
    [dispatch],
  );

  // go to preview page
  const onPreview = useCallback(
    (id: string): void => {
      navigate(goToArticle(id));
    },
    [navigate],
  );

  const onEdit = useCallback(
    (article: IArticle): void => {
      navigate(goToEditArticle(article.objectId));
    },
    [navigate],
  );

  const onCreate = (): void => {
    navigate(goToAddArticle());
  }

  // delete selected rows
  const handleDeleteSelected = async (ids: string[]): Promise<void | undefined> => {
    dispatch(toggleArticlesByIds(ids, 'deleted', false));
  };

  const onUpdateData = (queries: IQueriesInput) => {
    // the on tab change is not used here, we use it in on page enter with search params
    dispatch(loadArticles(queries));
  }

  // table data
  const dataTable = useMemo((): Data[] => {
    const canDelete = canAccessTo(roles, 'Article', 'delete');
    const canPreview = canAccessTo(roles, 'Article', 'get');
    const canEdit = canAccessTo(roles, 'Article', 'update');

    const articlesData = articles.map((article: IArticle) => {
      const title = getTranslatedField<ITranslatedFields>(article.translated, language, 'title')
      // default data
      const data: Record<string, any> = {
        id: article.objectId, // required even if not displayed
        title,
        createdAt: displayDate(article.createdAt, false, true),
        actions: canDestroy
          ? null
          : (
              <ButtonActions
                onDelete={canDelete ? () => onDelete(article) : undefined}
                onPreview={canPreview ? () => onPreview(article.objectId) : undefined}
                onEdit={canEdit ? () => onEdit(article) : undefined}
                value={article.reference}
              />
            )
          };

      return data as Data;
    });

    return articlesData;
  }, [articles, onDelete, onPreview, roles, onEdit, canDestroy, language]);

  return (
    <>
      <Head title="Articles" />
      <List
        tabs={articlesTabOptions}
        // @see articles.routes.tsx for search params definition
        defaultFilters={searchParams}
        enableMultipleSelect={!canDestroy}
        onUpdateData={onUpdateData}
        items={dataTable}
        onDeleteSelected={handleDeleteSelected}
        headCells={headCells}
        count={count}
        canDelete={canAccessTo(roles, 'Article', 'delete')}
        canUpdate={canAccessTo(roles, 'Article', 'update')}
        renderFilter={(prop: IRenderSearchProps) => <SearchArticles {...prop} />}
      />

      {canCreate && (
        <AddFab onClick={onCreate} />
      )}
    </>
  );
}

export default Articles;
