import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Grid, styled } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import SelectField from '@/components/form/fields/SelectField';
import Form from '@/components/form/Form';
import Head from '@/components/Head';
import Layout from '@/components/layouts/Layout';

import { locales } from '@/config/i18n';

import { changeSettings } from '@/redux/actions/app.action';
import { getSettingsLangSelector } from '@/redux/reducers/settings.reducer';

import { settingsSchema } from '@/validations/app.validations';

import { RESPONSIVE_BREAKPOINT } from '@/utils/constants';
import { renderLanguageLabel } from '@/utils/settings.utils';

import { ISettingsInput } from '@/types/app.type';

import SettingsTheme from '@/containers/settings/SettingsTheme';

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    [theme.breakpoints.down(RESPONSIVE_BREAKPOINT)]: {
      paddingLeft: 0,
    },
  },
}));
const sx = {
  card: {
    p: 3,
    pt: 2,
  },
};
const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const title = t('settings');
  const storedLang = useSelector(getSettingsLangSelector);

  const form = useForm<ISettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      lang: storedLang as any,
    },
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ISettingsInput> = async values => {
    await dispatch(changeSettings(values));
  };

  const options = locales.map((lang: any) => ({ value: lang, label: renderLanguageLabel(lang) }));

  return (
    <Layout title={title} isCard={false}>
      <Head title={title} />
      <StyledGridContainer container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Card sx={sx.card}>
            <Form form={form} onSubmit={handleSubmit(onSubmitHandler)}>
              <SelectField name="lang" options={options} label={t('languages')} />
            </Form>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={sx.card}>
            <SettingsTheme />
          </Card>
        </Grid>
      </StyledGridContainer>
    </Layout>
  );
};

export default Settings;
