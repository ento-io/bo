import { Button, Stack, Theme, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import { ReactNode } from 'react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
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
import { IPage } from '@/types/page.type';
import { useProtect } from '@/hooks/useProtect';
import TextEditor from '@/components/form/inputs/textEditor/TextEditor';
import TranslatedFormTabs from '@/components/form/translated/TranslatedFormTabs';
import PreviewImages from '@/containers/cms/PreviewImages';
import BooleanIcons from '@/components/BooleanIcons';
import { getServerUrl } from '@/utils/utils';
import { getTranslatedField } from '@/utils/settings.utils';
import { ICategoryTranslatedFields } from '@/types/category.type';
import { goToAddPageBlocks, goToEditPageBlocks } from '@/redux/actions/pageBlock.action';
import { PATH_NAMES } from '@/utils/pathnames';
import Link from '@/components/Link';
import { usePageTranslatedValuesByTab } from '@/hooks/usePageTranslatedValuesByTab';

const classes = {
  imageContainer: (theme: Theme) => ({
    width: 500,
    height: 300,
    overflow: 'hidden',
    '& > img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  }),
  blockTexts: (imagePosition: 'bottom' | 'right' | 'left') => (theme: Theme) => {
    switch (imagePosition) {
      case 'right':
        return {
          order: -1
        }
      case 'left':
        return {
          order: 1
        }
      case 'bottom':
        return {
          marginBottom: 8,
          // the text should be above the image
          order: -1
        }
      default:
        return {
          [theme.breakpoints.down('md')]: {
            order: -1
          },
        }
    }
  },
  block: (imagePosition: 'bottom' | 'right' | 'left') => (theme: Theme) => {
    switch (imagePosition) {
      case 'bottom':
        return {
          flexDirection: 'column' as const,
          display: 'flex',
        }
      default:
        return {
          flexDirection: 'row' as const,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column' as const,
          },
        }
    }
  }
};

const Page = () => {
  const { t } = useTranslation(['common', 'user', 'cms']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const page = useSelector(getPagePageSelector);

  const { canPreview, canDelete, canCreate, canFind } = useProtect('Page');

  const {
    translatedBlockFields,
    translatedFields,
    onTabChange,
    tab,
  } = usePageTranslatedValuesByTab(page);

  if (!page) return null;

  const infosItems: ISelectOption[] = [
    {
      label: t('cms:title'),
      value: translatedFields.title,
    },
    {
      label: t('cms:category.category'),
      value: page.category
      ? (
        <Link
          to={PATH_NAMES.pages}
          search={{
            category: page.category.objectId,
          }}
        >
          {getTranslatedField<ICategoryTranslatedFields>(page.category.translated, tab, 'name')}
        </Link>
      )
      : '',
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

  const handleEditBlocks = () => {
    navigate(goToEditPageBlocks(page.objectId));
  };

  const handleAddBlocks = () => {
    navigate(goToAddPageBlocks(page.objectId));
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
        fixedOnScroll
      />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        {/* left */}
        <Grid item {...PREVIEW_PAGE_GRID.left}>
          <Stack spacing={3}>
            {/* main infos bloc */}
            <Layout cardTitle={t('common:details')}>
              <Items items={infosItems} />
            </Layout>
            {/* SEO block */}
            <Layout cardTitle={t('cms:seo')} cardDescription={t('cms:seoDescription')}>
              <Items items={seoItems} />
            </Layout>
            {/* content */}
            <Layout cardTitle={t('cms:mainContentOfThePage')}>
              <TextEditor value={translatedFields.content} editable={false} />
            </Layout>

            {/* blocks */}
            <Layout
              cardTitle={t('cms:blocks')}
              actionsEmplacement='content'
              actions={page.blocks && page.blocks.length > 0
                ? (
                  <Button
                    startIcon={<FiEdit2 size={16} />}
                    onClick={handleEditBlocks}
                  >
                    {t('cms:editBlocks')}
                  </Button>
                ) : (
                  <Button
                    startIcon={<FiPlus size={16} />}
                    onClick={handleAddBlocks}
                  >
                    {t('cms:addBlocks')}
                  </Button>
                )
              }
            >
              <Stack spacing={3}>
                <div>
                  <Items items={[
                    {
                      label: t('cms:blocksTitle'),
                      value: translatedFields.blockTitle,
                    },
                    {
                      label: t('cms:blocksDescription'),
                      value: translatedFields.blockDescription,
                    }
                  ]}
                  />
                </div>
                {translatedBlockFields.map((block, index) => (
                  <div
                    key={index}
                    css={classes.block(block.imagePosition)}
                  >
                    <div css={classes.imageContainer} className="flex1">
                      {block.image && <img alt="block" src={block.image.url} css={{ width: '100%' }} />}
                    </div>
                    <div className="flexColumn flex1" css={classes.blockTexts(block.imagePosition)}>
                      <Typography variant="h5">{block.title}</Typography>
                      {block.description && <Typography>{block.description}</Typography>}
                      <TextEditor value={block.content} editable={false} />
                    </div>
                  </div>
                ))}
              </Stack>
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
