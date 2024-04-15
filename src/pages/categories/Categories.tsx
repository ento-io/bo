import { ReactNode, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCategoryCountSelector, getCategoryCategoriesSelector } from '@/redux/reducers/category.reducer';
import { createCategory, deleteCategory, editCategory, goToCategory, loadCategories, toggleCategoriesByIds } from '@/redux/actions/category.action';
import List from '@/components/table/List';
import { displayDate } from '@/utils/date.utils';
import { getRoleCurrentUserRolesSelector } from '@/redux/reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import i18n from '@/config/i18n';
import { IQueriesInput, IRenderSearchProps, TableHeadCell } from '@/types/app.type';
import ButtonActions from '@/components/ButtonActions';
import Head from '@/components/Head';
import { ICategory, ICategoryInput, ITranslatedFields } from '@/types/category.types';
import AddFab from '@/components/AddFab';
import { articlesTabOptions, getCategoryEntityLabel } from '@/utils/cms.utils';
import { getSettingsLangSelector } from '@/redux/reducers/settings.reducer';
import { getTranslatedField } from '@/utils/settings.utils';
import { useToggle } from '@/hooks/useToggle';
import Dialog from '@/components/Dialog';
import CategoryForm from '@/containers/categories/CategoryForm';
import { categoriesRoute } from '@/routes/protected/category.routes';
import { isRecycleBinTab } from '@/utils/app.utils';
import SearchCategories from '@/containers/categories/SearchCategories';

const CATEGORY_FORM_ID = 'send-email-form-id'

interface Data {
  name: string;
  entity: string;
  createdAt: string;
  updatedAt: string;
  actions: ReactNode;
}

const headCells: TableHeadCell<keyof Data>[] = [
  {
    id: 'name',
    label: i18n.t('cms:name'),
  },
  {
    id: 'entity',
    label: i18n.t('cms:category.categoryFor'),
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

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation(['cms', 'common']);
  const categories = useSelector(getCategoryCategoriesSelector);
  const { open: isOpenCreation, toggle: toggleOpenCreation } = useToggle();
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const searchParams = categoriesRoute.useSearch();

  const language = useSelector(getSettingsLangSelector);

  const count = useSelector(getCategoryCountSelector);

  const roles = useSelector(getRoleCurrentUserRolesSelector);
  const canCreate = canAccessTo(roles, 'Category', 'create');

  const canDestroy = searchParams.tab && isRecycleBinTab(searchParams.tab);

  // delete a row
  const onDelete = useCallback(
    (article: ICategory): void => {
      dispatch(deleteCategory(article.objectId));
    },
    [dispatch],
  );

  // go to preview page
  const onPreview = useCallback(
    (id: string): void => {
      navigate(goToCategory(id));
    },
    [navigate],
  );

  const onEdit = useCallback(
    (category: ICategory): void => {
      setSelectedCategory(category);
      toggleOpenCreation();
    },
    [toggleOpenCreation],
  );

  const handleCloseDialog = () => {
    setSelectedCategory(null);
    toggleOpenCreation();
  };

  // delete selected rows
  const handleDeleteSelected = async (ids: string[]): Promise<void | undefined> => {
    dispatch(toggleCategoriesByIds(ids, 'deleted', false));
  };

  const onUpdateData = (queries: IQueriesInput) => {
    // the on tab change is not used here, we use it in on page enter with search params
    dispatch(loadCategories(queries));
  }

  const handleSubmitCategory = (values: ICategoryInput) => {
    if (selectedCategory) {
      dispatch(editCategory(selectedCategory.objectId, values));
      handleCloseDialog();
      return;
    }

    dispatch(createCategory(values));
    handleCloseDialog();
  };

  // table data
  const dataTable = useMemo((): Data[] => {
    const canDelete = canAccessTo(roles, 'Category', 'delete');
    const canPreview = canAccessTo(roles, 'Category', 'get');
    const canEdit = canAccessTo(roles, 'Category', 'update');

    const categoriesData = categories.map((category: ICategory) => {
      const name = getTranslatedField<ITranslatedFields>(category.translated, language, 'name')
      // default data
      const data: Record<string, any> = {
        id: category.objectId, // required even if not displayed
        name,
        entity: getCategoryEntityLabel(category.entity),
        createdAt: displayDate(category.createdAt, false, true),
        updatedAt: displayDate(category.updatedAt, false, true),
        actions: canDestroy
          ? null
          : (
              <ButtonActions
                onDelete={canDelete ? () => onDelete(category) : undefined}
                onPreview={canPreview ? () => onPreview(category.objectId) : undefined}
                onEdit={canEdit ? () => onEdit(category) : undefined}
                value={category.reference}
              />
            )
        };

      return data as Data;
    });

    return categoriesData;
  }, [categories, onDelete, onPreview, roles, onEdit, language, canDestroy]);

  return (
    <>
      <Head title="Categories" />
      <List
        tabs={articlesTabOptions}
        // @see estimates.routes.tsx for search params definition
        defaultFilters={searchParams}
        enableMultipleSelect={!canDestroy}
        onUpdateData={onUpdateData}
        items={dataTable}
        onDeleteSelected={handleDeleteSelected}
        headCells={headCells}
        count={count}
        canDelete={canAccessTo(roles, 'Category', 'delete')}
        canUpdate={canAccessTo(roles, 'Category', 'update')}
        renderFilter={(prop: IRenderSearchProps) => <SearchCategories {...prop} />}

      />

      {canCreate && (
        <AddFab
          onClick={() => {
            setSelectedCategory(null);
            toggleOpenCreation();
          }}
        />
      )}

      <Dialog
        title={selectedCategory ? t('cms:category.editCategory') : t('cms:category.createCategory')}
        open={!!selectedCategory || isOpenCreation}
        toggle={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        formId={CATEGORY_FORM_ID}
      >
        <CategoryForm
          formId={CATEGORY_FORM_ID}
          onSubmit={handleSubmitCategory}
          category={selectedCategory}
        />
      </Dialog>
    </>
  );
}

export default Categories;
