import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useFormContext } from 'react-hook-form';
import TextField from '@/components/form/fields/TextField';

import { getServerUrl, slugify } from '@/utils/utils';
import { Lang } from '@/types/setting.type';

type Props = {
  locale: string;
  tab: Lang;
};

const TranslatedSlugField = ({ locale, tab }: Props) => {
  const { t } = useTranslation();
  const {
    watch,
  } = useFormContext();
  
  // helper text below slug input
  const transformSlugPreview = useCallback(
    (value: string): string => {
      let text = '../../'; // default value
      const translatedFieldValue = watch(tab + ':name'); // field to watch and get the change

      if (value) {
        text = slugify(value);
      } else if (translatedFieldValue) {
        text = slugify(translatedFieldValue);
      }

      return text;
    },
    [watch, tab],
  );

  return (
    <TextField
      name={locale + ':slug'}
      label="Slug"
      fixedLabel
      type="text"
      variant="outlined"
      transformValuePreview={transformSlugPreview}
      preview={getServerUrl() + '/'}
      tooltip={t('common:uniqueUrl', { theEntity: t('cms:category.theCategory') })}
    />
  );
};

export default TranslatedSlugField;
