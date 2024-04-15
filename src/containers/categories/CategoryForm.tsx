import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CheckboxField from '@/components/form/fields/CheckboxField';
import TextField from '@/components/form/fields/TextField';
import TranslatedFormTabs from '@/components/form/translated/TranslatedFormTabs';

import { locales } from '@/config/i18n';

import { DEFAULT_LANGUAGE } from '@/utils/constants';
import { categoryEntityOptions, getCategoryFormInitialValues, TRANSLATED_CMS_FIELDS } from '@/utils/cms.utils';
import { getTranslatedFormTabErrors } from '@/utils/utils';

import { ICategory, ICategoryInput } from '@/types/category.types';
import { categorySchema } from '@/validations/category.validation';
import Form from '@/components/form/Form';
import SelectField from '@/components/form/fields/SelectField';
import { useTranslatedValuesByTab } from '@/hooks/useTranslatedValuesByTab';
import TranslatedSlugField from '../cms/TranslatedSlugField';

type Props = {
  formId: string;
  category?: ICategory | null;
  onSubmit: (values: ICategoryInput) => void;
};

const CategoryForm = ({ formId, category, onSubmit }: Props) => {
  const { t } = useTranslation();
  // get translated fields depending on the selected language (tabs)
  const { onTabChange, tab } = useTranslatedValuesByTab();

  const form = useForm<ICategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: getCategoryFormInitialValues(category),
  });

  const { handleSubmit, setValue } = form;

  const handleFormSubmit: SubmitHandler<ICategoryInput> = async values => {
    onSubmit(values);
  };

  // change translated slug field value when name is changed
  const handleNameChange = (value: string | number) => {
    setValue(tab + ':slug', value, { shouldValidate: true });
  };

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
              onFieldChange={handleNameChange}
            />
            {/* slug field */}
            <TranslatedSlugField tab={tab} locale={locale} />
          </div>
        ))}
      </div>

      <SelectField
        name="entity"
        options={categoryEntityOptions}
        label={t('cms:category.categoryFor')}
        helperText={t('cms:category.categoryForHelper')}
        isClearable
      />

      <CheckboxField name="active" label={t('common:active')} tooltip={t('cms:category.activeCategoryVisible')} />
    </Form>
  );
};

export default CategoryForm;
