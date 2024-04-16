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
import { getPagePageSelector } from '@/redux/reducers/page.reducer';
import { deletePage, goToAddPage, goToPages, goToEditPage } from '@/redux/actions/page.action';
import ItemsStatus from '@/components/ItemsStatus';
import UsersForEntity from '@/containers/users/UsersForEntity';
import { IPage, IPageTranslatedFields } from '@/types/page.type';
import { useProtect } from '@/hooks/useProtect';
import TextEditor from '@/components/form/inputs/textEditor/TextEditor';
import TranslatedFormTabs from '@/components/form/translated/TranslatedFormTabs';
import { useTranslatedValuesByTab } from '@/hooks/useTranslatedValuesByTab';
import PreviewImages from '@/containers/cms/PreviewImages';
import BooleanIcons from '@/components/BooleanIcons';
import { getTranslatedCategoriesName } from '@/utils/cms.utils';
import { getServerUrl } from '@/utils/utils';

const Page = () => {
  const { t } = useTranslation(['common', 'user', 'cms']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const page = useSelector(getPagePageSelector);

  const { canPreview, canDelete, canCreate, canFind } = useProtect('Page');

  // get translated fields depending on the selected language (tabs)
  const { translatedFields, onTabChange, tab } = useTranslatedValuesByTab<IPageTranslatedFields>(page?.translated, ['title', 'content']);

  if (!page) return null;

  const infosItems: ISelectOption[] = [
    {
      label: t('cms:title'),
      value: translatedFields.title,
    },
    {
      label: t('cms:category.categories'),
      value: getTranslatedCategoriesName(page.categories, tab),
    },
    {
      label: t('common:createdAt'),
      value: displayDate(page.createdAt),
    },
    {
      label: t('common:updatedAt'),
      value: displayDate(page.updatedAt),
    },
    {
      label: t('common:deletedAt'),
      value: displayDate(page.deletedAt),
      hide: !page.deletedAt
    },
  ];

  const seoItems: ISelectOption[] = [
    {
      label: `Slug (${t('common:uniqueUrl', { theEntity: t('cms:category.theCategory') })})`,
      value: translatedFields.slug ? getServerUrl() + '/../../' + translatedFields.slug : '',
    },
    {
      label: 'Tags',
      value: translatedFields.tags,
    },
    {
      label: t('common:metaTitle'),
      value: translatedFields.metaTitle,
    },
    {
      label: t('common:metaDescription'),
      value: translatedFields.metaDescription,
    },
  ];

  const statusItems: ISelectOption<ReactNode>[] = [
    {
      label: t('common:active'),
      value: <BooleanIcons value={page.active} />,
    },
  ];

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToPages());
  };

  const handleEdit = () => {
    if (!canPreview) return;
    navigate(goToEditPage(page.objectId));
  }

  const handleDelete = async () => {
    if (!canDelete) return;
    await dispatch(deletePage(page.objectId));
    navigate(goToPages());
  }

  const handleCreate = () => {
    if (!canCreate) return;
    navigate(goToAddPage());
  }

  // for notification
  const togglePublish = () => {
    dispatch(toggleUserNotification(page.objectId));
  };

  const menus = [
    {
      onClick: togglePublish,
      display: true,
      label: page.active ? t('cms:noToPublish') : t('cms:publish'),
      icon: page.active ? <FaCheck /> : <FaCheckDouble />
    },
  ];

  return (
    <Layout
      title={(
        <>
          <span>{t('cms:page')}</span>
          <span css={{ marginRight: 10, marginLeft: 10 }}>-</span>
          <span>{translatedFields.title}</span>
        </>
      )}
      isCard={false}
      actions={
        <ActionsMenu
          label={translatedFields.title}
          onCreate={handleCreate}
          goToList={handleGoToList}
          onDelete={handleDelete}
          onEdit={handleEdit}
          menus={menus}
        />
      }>
      <Head title={translatedFields.title} />
      <TranslatedFormTabs
        onTabChange={onTabChange}
        tab={tab}
        // errors={getTranslatedFormTabErrors(form?.formState.errors, TRANSLATED_PAGE_FIELDS)}
      />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        {/* left */}
        <Grid item {...PREVIEW_PAGE_GRID.left}>
          <Stack spacing={3}>
            <Layout cardTitle={t('common:details')}>
              <Items items={infosItems} />
            </Layout>
            <Layout cardTitle={t('cms:seo')} cardDescription={t('cms:seoDescription')}>
              <Items items={seoItems} />
            </Layout>
            <Layout>
              <TextEditor value={translatedFields.content} editable={false} />
            </Layout>

            {/* images */}
            <PreviewImages<IPage> page={page} />
          </Stack>
        </Grid>
        {/* right */}
        <Grid item {...PREVIEW_PAGE_GRID.right}>
          <Stack spacing={3}>
            <Layout  cardTitle={t('user:createdBy')}>
              <UserInfo user={page.user} />
            </Layout>
            <Layout cardTitle="Status">
              <ItemsStatus entity={page} items={statusItems} />
            </Layout>
          </Stack>
        </Grid>
        {/* bottom */}
        <UsersForEntity<IPage, ISelectOption<('updatedBy' | 'deletedBy')>[]>
          object={page}
          keys={[{
            label: t('user:updatedBy'),
            value: 'updatedBy',
          }, {
            label: t('user:deletedBy'),
            value: 'deletedBy',
          }]}
        />
      </Grid>
    </Layout>
  );
};

export default Page;
