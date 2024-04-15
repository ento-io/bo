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
import { getArticleArticleSelector } from '@/redux/reducers/article.reducer';
import { deleteArticle, goToAddArticle, goToArticles, goToEditArticle } from '@/redux/actions/article.action';
import ItemsStatus from '@/components/ItemsStatus';
import UsersForEntity from '@/containers/users/UsersForEntity';
import { IArticle, IArticleTranslatedFields } from '@/types/article.types';
import { useProtect } from '@/hooks/useProtect';
import TextEditor from '@/components/form/inputs/textEditor/TextEditor';
import TranslatedFormTabs from '@/components/form/translated/TranslatedFormTabs';
import { useTranslatedValuesByTab } from '@/hooks/useTranslatedValuesByTab';
import PreviewImages from '@/containers/cms/PreviewImages';
import BooleanIcons from '@/components/BooleanIcons';
import { getTranslatedCategoriesName } from '@/utils/cms.utils';

const Article = () => {
  const { t } = useTranslation(['common', 'user', 'cms']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const article = useSelector(getArticleArticleSelector);

  const { canPreview, canDelete, canCreate, canFind } = useProtect('Article');

  // get translated fields depending on the selected language (tabs)
  const { translatedFields, onTabChange, tab } = useTranslatedValuesByTab<IArticleTranslatedFields>(article?.translated, ['title', 'content']);

  if (!article) return null;

  const infosItems: ISelectOption[] = [
    {
      label: t('cms:title'),
      value: translatedFields.title,
    },
    {
      label: t('cms:category.categories'),
      value: getTranslatedCategoriesName(article.categories, tab),
    },
    {
      label: t('common:createdAt'),
      value: displayDate(article.createdAt),
    },
    {
      label: t('common:updatedAt'),
      value: displayDate(article.updatedAt),
    },
    {
      label: t('common:deletedAt'),
      value: displayDate(article.deletedAt),
      hide: !article.deletedAt
    },
  ];

  const statusItems: ISelectOption<ReactNode>[] = [
    {
      label: t('common:active'),
      value: <BooleanIcons value={article.active} />,
    },
  ];

  const handleGoToList = () => {
    if (!canFind) return;
    navigate(goToArticles());
  };

  const handleEdit = () => {
    if (!canPreview) return;
    navigate(goToEditArticle(article.objectId));
  }

  const handleDelete = async () => {
    if (!canDelete) return;
    await dispatch(deleteArticle(article.objectId));
    navigate(goToArticles());
  }

  const handleCreate = () => {
    if (!canCreate) return;
    navigate(goToAddArticle());
  }

  // for notification
  const togglePublish = () => {
    dispatch(toggleUserNotification(article.objectId));
  };

  const menus = [
    {
      onClick: togglePublish,
      display: true,
      label: article.active ? t('cms:noToPublish') : t('cms:publish'),
      icon: article.active ? <FaCheck /> : <FaCheckDouble />
    },
  ];

  return (
    <Layout
      title={(
        <>
          <span>{t('cms:article')}</span>
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
            <Layout>
              <TextEditor value={translatedFields.content} editable={false} />
            </Layout>

            {/* images */}
            <PreviewImages<IArticle> page={article} />
          </Stack>
        </Grid>
        {/* right */}
        <Grid item {...PREVIEW_PAGE_GRID.right}>
          <Stack spacing={3}>
            <Layout  cardTitle={t('user:createdBy')}>
              <UserInfo user={article.user} />
            </Layout>
            <Layout cardTitle="Status">
              <ItemsStatus entity={article} items={statusItems} />
            </Layout>
          </Stack>
        </Grid>
        {/* bottom */}
        <UsersForEntity<IArticle, ISelectOption<('updatedBy' | 'deletedBy')>[]>
          object={article}
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

export default Article;
