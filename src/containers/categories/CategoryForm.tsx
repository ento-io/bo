import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import CheckboxField from '@/components/form/fields/CheckboxField';
import TextField from '@/components/form/fields/TextField';
import TranslatedFormTabs from '@/components/form/translated/TranslatedFormTabs';

import { locales } from '@/config/i18n';

import { DEFAULT_LANGUAGE } from '@/utils/constants';
import { getCategoryFormInitialValues, TRANSLATED_CMS_FIELDS } from '@/utils/cms.utils';
import { getTranslatedFormTabErrors } from '@/utils/utils';

import { Lang } from '@/types/setting.type';
import { getSettingsLangSelector } from '@/redux/reducers/settings.reducer';
import { ICategory, ICategoryInput } from '@/types/category.types';
import { categorySchema } from '@/validations/category.validation';
import Form from '@/components/form/Form';

type Props = {
  formId: string;
  category?: ICategory | null;
  onSubmit: (values: ICategoryInput) => void;
};

const CategoryForm = ({ formId, category, onSubmit }: Props) => {
  const { t } = useTranslation();
  const language: any = useSelector(getSettingsLangSelector);
  const [tab, setTab] = useState<Lang>(language);

  const form = useForm<ICategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: getCategoryFormInitialValues(category),
  });

  const { handleSubmit } = form;

  const handleFormSubmit: SubmitHandler<ICategoryInput> = async values => {
    onSubmit(values);
  };

  const onTabChange = (value: Lang) => setTab(value);

  return (
    <Form formId={formId} form={form} onSubmit={handleSubmit(handleFormSubmit)}>
      {/* translated tabs */}
      <TranslatedFormTabs
        onTabChange={onTabChange}
        tab={tab}
        errors={getTranslatedFormTabErrors(form?.formState.errors, TRANSLATED_CMS_FIELDS)}
      />
      <div>
        {locales.map((locale: string, index: number) => (
          <div key={index} css={{ display: locale === tab ? 'block' : 'none' }}>
            <TextField
              name={locale + ':name'}
              label={t('common:name')}
              fixedLabel
              type="text"
              variant="outlined"
              required={locale === DEFAULT_LANGUAGE}
            />
          </div>
        ))}
      </div>

      <CheckboxField name="active" label={t('common:active')} tooltip={t('cms:category.activeCategoryVisible')} />
    </Form>
  );
};

export default CategoryForm;
