import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import { ReactNode } from 'react';
import ActionsMenu from '@/components/ActionsMenu';
import Head from '@/components/Head';
import Items from '@/components/Items';
import Layout from '@/components/layouts/Layout';

import { toggleUserNotification } from '@/redux/actions/user.action';

import { PREVIEW_PAGE_GRID } from '@/utils/constants';
import { displayDate } from '@/utils/date.utils';

import { ISelectOption } from '@/types/app.type';
import UserInfo from '@/containers/users/UserInfos';
import { getCategoryCategorySelector } from '@/redux/reducers/category.reducer';
import { deleteCategory, editCategory, goToCategories } from '@/redux/actions/category.action';
import ItemsStatus from '@/components/ItemsStatus';
import UsersForEntity from '@/containers/users/UsersForEntity';
import { ICategory, ICategoryInput, ITranslatedFields } from '@/types/category.types';
import { useProtect } from '@/hooks/useProtect';
import TranslatedFormTabs from '@/components/form/translated/TranslatedFormTabs';
import { useTranslatedValuesByTab } from '@/hooks/useTranslatedValues';
import BooleanIcons from '@/components/BooleanIcons';
import { getCategoryEntityLabel } from '@/utils/cms.utils';
import { useToggle } from '@/hooks/useToggle';
import CategoryForm from '@/containers/categories/CategoryForm';
import Dialog from '@/components/Dialog';

const CATEGORY_FORM_ID = 'category-form-id';

const Category = () => {
  const { t } = useTranslation(['common', 'user', 'cms']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const category = useSelector(getCategoryCategorySelector);
  const { open: openEditionDialog, toggle: toggleEditionDialog } = useToggle();

  const { canDelete, canFind } = useProtect('Category');

  // get translated fields depending on the selected language (tabs)
  const { translatedFields, onTabChange, tab } = useTranslatedValuesByTab<ITranslatedFields>(category?.translated, ['name']);

  if (!category) return null;

  const infosItems: ISelectOption[] = [
    {
      label: t('cms:name'),
      value: translatedFields.name,
    },
    {
      label: t('cms:category.categoryFor'),
      value: getCategoryEntityLabel(category.entity)
    },
    {
      label: t('common:createdAt'),
      value: displayDate(category.createdAt),
    },
    {
      label: t('common:updatedAt'),
      value: displayDate(category.updatedAt),
    },
    {
      label: t('common:deletedAt'),
      value: displayDate(category.deletedAt),
      hide: !category.deletedAt
    },
  ];

  const statusItems: ISelectOption<ReactNode>[] = [
    {
      label: t('common:active'),
      value: <BooleanIcons value={category.active} />,
    },
  ];

  
  const handleSubmitCategory = (values: ICategoryInput) => {
    dispatch(editCategory(category.objectId, values));
    toggleEditionDialog();
  };


  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToCategories());
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    await dispatch(deleteCategory(category.objectId));
    navigate(goToCategories());
  }


  // for notification
  const togglePublish = () => {
    dispatch(toggleUserNotification(category.objectId));
  };

  const menus = [
    {
      onClick: togglePublish,
      display: true,
      label: category.active ? t('cms:noToPublish') : t('cms:publish'),
      icon: category.active ? <FaCheck /> : <FaCheckDouble />
    },
  ];

  return (
    <Layout
      title={(
        <>
          <span>{t('cms:category.category')}</span>
          <span css={{ marginRight: 10, marginLeft: 10 }}>-</span>
          <span>{translatedFields.name} ({getCategoryEntityLabel(category.entity)})</span>
        </>
      )}
      isCard={false}
      actions={
        <ActionsMenu
          label={translatedFields.name}
          // onCreate={handleCreate}
          goToList={handleGoToList}
          onDelete={handleDelete}
          onEdit={toggleEditionDialog}
          menus={menus}
        />
      }>
      <Head title={translatedFields.name} />
      <TranslatedFormTabs
        onTabChange={onTabChange}
        tab={tab}
      />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        {/* left */}
        <Grid item {...PREVIEW_PAGE_GRID.left}>
          <Stack spacing={3}>
            <Layout cardTitle={t('common:details')}>
              <Items items={infosItems} />
            </Layout>
          </Stack>
        </Grid>
        {/* right */}
        <Grid item {...PREVIEW_PAGE_GRID.right}>
          <Stack spacing={3}>
            <Layout  cardTitle={t('user:createdBy')}>
              <UserInfo user={category.user} />
            </Layout>
            <Layout cardTitle="Status">
              <ItemsStatus entity={category} items={statusItems} />
            </Layout>
          </Stack>
        </Grid>
        {/* bottom */}
        <UsersForEntity<ICategory, ISelectOption<('updatedBy' | 'deletedBy')>[]>
          object={category}
          keys={[{
            label: t('user:updatedBy'),
            value: 'updatedBy',
          }, {
            label: t('user:deletedBy'),
            value: 'deletedBy',
          }]}
        />
      </Grid>

      <Dialog
        title={t('cms:category.editCategory')}
        open={openEditionDialog}
        toggle={toggleEditionDialog}
        maxWidth="md"
        fullWidth
        formId={CATEGORY_FORM_ID}
      >
        <CategoryForm
          formId={CATEGORY_FORM_ID}
          onSubmit={handleSubmitCategory}
          category={category}
        />
      </Dialog>
    </Layout>
  );
};

export default Category;
