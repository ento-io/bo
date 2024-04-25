import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { Stack } from "@mui/material";
import { IPage, IPageStepOneInput } from "@/types/page.type"
import TextField from "@/components/form/fields/TextField";
import Form, { IFormProps } from "@/components/form/Form";
import { pageStepOneSchema } from "@/validations/page.validations";
import TextEditorField from "@/components/form/fields/TextEditorField";
import { getTranslatedFormTabErrors } from "@/utils/utils";
import { TRANSLATED_CMS_FIELDS, getPageStepOneEditionInitialValues } from "@/utils/cms.utils";
import LanguageTabs from "@/components/form/translated/TranslatedFormTabs";
import { locales } from "@/config/i18n";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import CardFormBlock from "@/components/form/CardFormBlock";
import { useTranslatedValuesByTab } from "@/hooks/useTranslatedValuesByTab";
import TranslatedSlugField from "../../cms/TranslatedSlugField";

type Props = {
  onSubmit: (values: IPageStepOneInput) => void;
  page?: IPage | null;
  loading?: boolean;
} & Pick<IFormProps, 'buttonDirection' | 'onSecondaryButtonClick' | 'primaryButtonText'>;

const PageFormStepOne = ({ onSubmit, page, loading, ...formProps }: Props) => {
  // get translated fields depending on the selected language (tabs)
  const { onTabChange, tab } = useTranslatedValuesByTab();

  const form = useForm<IPageStepOneInput>({
    // defaultValues: initialValues,
    resolver: zodResolver(pageStepOneSchema),
  });

  const { handleSubmit, reset, setValue } = form;

  // initialize form values
  useEffect(() => {
    if (!page) return;
    const init = async () => {
      const editionInitialValues = await getPageStepOneEditionInitialValues(page);
      reset(editionInitialValues)
    };

    init();
  }, [page, reset]);

  // change translated slug field value when the page name is changed
  const handlePageNameChange = (value: string | number) => {
    setValue(tab + ':slug', value, { shouldValidate: true });
  };

  const onFormSubmit: SubmitHandler<IPageStepOneInput> = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit(onFormSubmit)}
      loading={loading}
      isDisabled={false}
      {...formProps}
    >
      <CardFormBlock title={t('details')} description={t('cms:translatedFields')}>
        {/* translated tabs */}
        <LanguageTabs
          onTabChange={onTabChange}
          tab={tab}
          errors={getTranslatedFormTabErrors(form?.formState.errors, TRANSLATED_CMS_FIELDS)}
        />
        {/* all translated fields */}
        {locales.map((locale: string, index: number) => (
          // hide other locale fields, display only the selected (current) locale
          <div key={index} css={{ display: locale === tab ? 'block' : 'none', marginTop: 12 }}>
            <Stack spacing={2}>
              <TextField
                name={locale + ':name'}
                label={t('cms:pageName')}
                fixedLabel
                type="text"
                variant="outlined"
                required={locale === DEFAULT_LANGUAGE}
                helperText={t('cms:pageNameHelper')}
                onFieldChange={handlePageNameChange}
              />
              <TextField
                name={locale + ':title'}
                label={t('cms:title')}
                fixedLabel
                type="text"
                variant="outlined"
                required={locale === DEFAULT_LANGUAGE}
                helperText={t('cms:pageTitleHelper')}
              />
              <TextField
                name={locale + ':description'}
                label={t('common:description')}
                fixedLabel
                type="text"
                variant="outlined"
                multiline
                rows={3}
              />
              <TextEditorField
                name={locale + ':content'}
                label={t('cms:content')}
                required={locale === DEFAULT_LANGUAGE}
              />

              {/* slug field */}
              <TranslatedSlugField tab={tab} locale={locale} />

              <TextField
                name={locale + ':tags'}
                label="Tags"
                fixedLabel
                type="text"
                variant="outlined"
                placeholder={t('common:infoMessages.separateTagsWithComma')}
                helperText={t('common:infoMessages.tagsHelper')}
              /> 
              <TextField
                name={locale + ':metaTitle'}
                label={t('common:metaTitle')}
                fixedLabel
                type="text"
                variant="outlined"
                helperText={t('common:infoMessages.metaTitleHelper')}
              />
              <TextField
                name={locale + ':metaDescription'}
                label={t('common:metaDescription')}
                fixedLabel
                type="text"
                variant="outlined"
                multiline
                rows={3}
                helperText={t('common:infoMessages.metaDescriptionHelper')}
              />
            </Stack>
          </div>
        ))}
      </CardFormBlock>
    </Form>
  )
}

export default PageFormStepOne;