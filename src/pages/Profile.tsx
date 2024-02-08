import { Typography } from '@mui/material';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ReactNode } from 'react';
import Avatar from '@/components/Avatar';
import Head from '@/components/Head';
import Items from '@/components/Items';
import Layout from '@/components/layouts/Layout';

import { getAppCurrentUserSelector } from '@/redux/reducers/app.reducer';

import { PREVIEW_PAGE_GRID } from '@/utils/constants';

import { ISelectOption } from '@/types/app.type';

import ProfileEditUserInfo from '@/containers/profile/ProfileEditUserInfo';
import ProfileEditUserPassword from '@/containers/profile/ProfileEditUserPassword';
import ProfilePicUploadButton from '@/containers/profile/ProfilePicUploadButton';

const Profile = () => {
  const user = useSelector(getAppCurrentUserSelector);
  const { t } = useTranslation();

  const title = t('common:myProfile');

  const userDetailsItems: ISelectOption<string | undefined>[] = [
    {
      label: t('user:lastName'),
      value: user.lastName,
    },
    {
      label: t('user:firstName'),
      value: user.firstName,
    },
  ];

  const accountInformationItems: ISelectOption<string | ReactNode>[] = [
    {
      label: t('user:email'),
      value: user.email,
    },
    {
      label: t('user:password'),
      value: (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>********</Typography>
          <ProfileEditUserPassword />
        </Stack>
      ),
    },
  ];

  return (
    <Layout isCard={false} title={title}>
      <Head title={title} />
      <Grid container spacing={PREVIEW_PAGE_GRID.spacing}>
        <Grid item {...PREVIEW_PAGE_GRID.left}>
          <Stack spacing={3}>
            <Layout
              cardTitle={t('user:detailsAboutYou')}
              actions={<ProfileEditUserInfo />}
              actionsEmplacement="content">
              <Items items={userDetailsItems} />
            </Layout>
            <Layout cardTitle={t('user:accountInformation')}>
              <Items items={accountInformationItems} />
            </Layout>
          </Stack>
        </Grid>

        <Grid item {...PREVIEW_PAGE_GRID.right} sx={{ order: { xs: -1, lg: 1 } }}>
          <Layout>
            <Box className="flexCenter">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<ProfilePicUploadButton />}>
                <Avatar user={user} size={64} />
              </Badge>
            </Box>
          </Layout>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;
