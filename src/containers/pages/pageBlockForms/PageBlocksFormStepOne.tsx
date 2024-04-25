import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { Stack } from "@mui/material";
import { IPage, IPageBlocksStepOneInput } from "@/types/page.type"
import TextField from "@/components/form/fields/TextField";
import Form, { IFormProps } from "@/components/form/Form";
import { pageBlocksStepOneSchema } from "@/validations/page.validations";
import { getTranslatedFormTabErrors } from "@/utils/utils";
import { TRANSLATED_CMS_FIELDS, getPageStepOneEditionInitialValues } from "@/utils/cms.utils";
import TranslationTabs from "@/components/form/translated/TranslationTabs";
import { locales } from "@/config/i18n";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import CardFormBlock from "@/components/form/CardFormBlock";
import { useTranslatedValuesByTab } from "@/hooks/useTranslatedValuesByTab";

type Props = {
  onSubmit: (values: IPageBlocksStepOneInput) => void;
  page?: IPage | null;
  loading?: boolean;
} & Pick<IFormProps, 'buttonDirection' | 'onSecondaryButtonClick' | 'primaryButtonText'>;

const PageBlocksFormStepOne = ({ onSubmit, page, loading, ...formProps }: Props) => {
  // get translated fields depending on the selected language (tabs)
  const { onTabChange, tab } = useTranslatedValuesByTab();

  const form = useForm<IPageBlocksStepOneInput>({
    // defaultValues: initialValues,
    resolver: zodResolver(pageBlocksStepOneSchema),
  });

  const { handleSubmit, reset } = form;

  // initialize form values
  useEffect(() => {
    if (!page) return;
    const init = async () => {
      const editionInitialValues = await getPageStepOneEditionInitialValues(page);
      reset(editionInitialValues)
    };

    init();
  }, [page, reset]);


  const onFormSubmit: SubmitHandler<IPageBlocksStepOneInput> = (values) => {
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
        <TranslationTabs
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
                name={locale + ':blockTitle'}
                label={t('cms:title')}
                fixedLabel
                type="text"
                variant="outlined"
                required={locale === DEFAULT_LANGUAGE}
                helperText={t('cms:pageTitleHelper')}
              />
              <TextField
                name={locale + ':blockDescription'}
                label={t('common:description')}
                fixedLabel
                type="text"
                variant="outlined"
                multiline
                rows={3}
              />
            </Stack>
          </div>
        ))}
      </CardFormBlock>
    </Form>
  )
}

export default PageBlocksFormStepOne;