import { useFieldArray, useFormContext } from 'react-hook-form';

import { useTranslation } from 'react-i18next';
import { Button, FormHelperText, Stack } from '@mui/material';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { css } from '@emotion/css';
import TextField from '@/components/form/fields/TextField';
import { DEFAULT_LANGUAGE } from '@/utils/constants';
import CardFormBlock from '@/components/form/CardFormBlock';
import { locales } from '@/config/i18n';
import TranslatedFormTabs from '@/components/form/translated/TranslatedFormTabs';
import { useTranslatedValuesByTab } from '@/hooks/useTranslatedValuesByTab';

type Props = {
  name: string;
};

const TranslatedPageBlocksField = ({ name }: Props) => {
  const { t } = useTranslation();
  const { onTabChange, tab } = useTranslatedValuesByTab();

  // hooks
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name
  });

  const watchFieldArray = watch(name);
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  return (
    <div>
        <TranslatedFormTabs
          onTabChange={onTabChange}
          tab={tab}
        />
        {controlledFields.map((item, index) => {
          const error = errors[name] ?( errors[name] as any)[index] : {};
          return (
            <div key={item.id}>
              {/* -------- each lang -------- */}
              {locales.map((locale: string) => {
                return (
                  <CardFormBlock title={'Block #' + (index + 1)} rootClassName={css({ display: locale === tab ? 'block' : 'none', marginTop: 12 })}>
                    <Stack spacing={1}>
                      <TextField
                        name={`${name}.${index}.${locale}:name`}
                        label={t('cms:pageName')}
                        fixedLabel
                        type="text"
                        variant="outlined"
                        required={locale === DEFAULT_LANGUAGE}
                        tooltip={t('cms:pageNameHelper')}
                        errorMessage={error[`${locale}:name`]}
                        fieldClassName="flex1"
                      />
                      {error && <FormHelperText error>{error[`${locale}:name`]?.message}</FormHelperText>}
                    </Stack>
                  </CardFormBlock>
                );
              })}
              {/* 
                * delete a line, each line of translated fields are removed
                * NOTE: it's should be outside of the locale loop
                * NOTE: it will remove each line of translated fields
              */}
              <div css={{ marginTop: 12 }}>
                <Button
                  startIcon={<FiTrash size={18} />}
                  onClick={() => remove(index)}
                  color="error"
                  variant="outlined"
                  css={{ padding: '4px 12px', borderRadius: 4 }}
                >
                  {t('delete')}
                </Button>
              </div>
            </div>
          )
        })}
      {/*
        * add a new line of translated fields
        * a new line for each translated fields
      */}
      <div css={{ marginTop: 12 }}>
        <Button
          startIcon={<FiPlus size={18} />}
          onClick={() => {
            const newLine = locales.reduce((acc, locale) => {
              // add new field here
              (acc as any)[`${name}.${controlledFields.length}.${locale}:name`] = '';
              return acc;
            }, {})

            append(newLine);
          }}
          color="primary"
          variant="outlined"
          css={{ padding: '4px 12px', borderRadius: 4 }}
        >
          Add line
        </Button>
      </div>
    </div>
  );
};

export default TranslatedPageBlocksField;