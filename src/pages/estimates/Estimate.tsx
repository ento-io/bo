import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from '@tanstack/react-router';
import ActionsMenu from '@/components/ActionsMenu';
import Head from '@/components/Head';
import Items from '@/components/Items';
import Layout from '@/components/layouts/Layout';

import { toggleUserNotification } from '@/redux/actions/user.action';

import { PREVIEW_PAGE_GRID } from '@/utils/constants';
import { displayDate } from '@/utils/date.utils';

import { ISelectOption } from '@/types/app.type';
import UserInfo from '@/containers/users/UserInfos';
import { getEstimateEstimateSelector } from '@/redux/reducers/estimate.reducer';
import { goToEstimates } from '@/redux/actions/estimate.action';
import ItemsStatus from '@/components/ItemsStatus';
import UsersForEntity from '@/containers/users/UsersForEntity';
import { IEstimate } from '@/types/estimate.types';

const Estimate = () => {
  const { t } = useTranslation(['common', 'user']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const estimate = useSelector(getEstimateEstimateSelector);

  if (!estimate) return null;

  const infosItems: ISelectOption[] = [
    {
      label: t('common:link'),
      value: <a href={estimate.url}>{estimate.url}</a> as any,
    },
    {
      label: t('common:estimates.reference'),
      value: estimate.reference,
    },
    {
      label: t('common:createdAt'),
      value: displayDate(estimate.createdAt),
    },
    {
      label: t('common:updatedAt'),
      value: displayDate(estimate.updatedAt),
    },
    {
      label: t('common:deletedAt'),
      value: displayDate(estimate.deletedAt),
      hide: !estimate.deletedAt
    },
  ];

  const handleGoToList = () => {
    navigate(goToEstimates())
  };

  // for notification
  const handleMarkAsSeen = () => {
    dispatch(toggleUserNotification(estimate.objectId));
  };

  return (
    <Layout
      title={t('common:estimates.estimate')}
      isCard={false}
      actions={
        <ActionsMenu label={estimate.lastName} goToList={handleGoToList} onMarkAsSeen={handleMarkAsSeen} />
      }>
      <Head title={t('common:estimates.reference')} />
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
              <UserInfo user={estimate.user} />
            </Layout>
            <Layout cardTitle="Status">
              <ItemsStatus entity={estimate} />
            </Layout>
          </Stack>
        </Grid>
        {/* bottom */}
        <UsersForEntity<IEstimate, ISelectOption<('createdBy' | 'updatedBy' | 'deletedBy')>[]>
          object={estimate}
          keys={[{
            label: t('user:createdBy'),
            value: 'createdBy',
          }, {
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

export default Estimate;
