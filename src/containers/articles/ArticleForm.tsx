import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { useSelector } from "react-redux";
import { Box, Stack } from "@mui/material";
import { IArticle, IArticleInput } from "@/types/article.types"
import TextField from "@/components/form/fields/TextField";
import Form from "@/components/form/Form";
import { articleSchema } from "@/validations/article.validations";
import TextEditorField from "@/components/form/fields/TextEditorField";
import { getTranslatedFormTabErrors } from "@/utils/utils";
import { TRANSLATED_CMS_FIELDS, getCmsEditionCmsInitialValues } from "@/utils/cms.utils";
import TranslatedFormTabs from "@/components/form/translated/TranslatedFormTabs";
import { Lang } from "@/types/setting.type";
import { getSettingsLangSelector } from "@/redux/reducers/settings.reducer";
import { locales } from "@/config/i18n";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import DropzoneField from "@/components/form/dropzone/DropzoneField";

const initialValues = {
  title: '',
  content: '',
};

type Props = {
  onSubmit: (values: IArticleInput) => void;
  article?: IArticle | null;
  loading?: boolean;
}

const ArticleForm = ({ onSubmit, article, loading }: Props) => {
  const language = useSelector(getSettingsLangSelector);

  const [tab, setTab] = useState<Lang>(language);

  const form = useForm<IArticleInput>({
    defaultValues: initialValues,
    resolver: zodResolver(articleSchema),
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (!article) return;
    const init = async () => {
      const editionInitialValues = await getCmsEditionCmsInitialValues(article);
      reset(editionInitialValues)
    };

    init();
  }, [article, reset]);

  const onFormSubmit: SubmitHandler<IArticleInput> = (values) => {
    onSubmit(values);
    reset(initialValues);
  }

  const onTabChange = (value: Lang) => setTab(value);

  return (
    <Form form={form} onSubmit={handleSubmit(onFormSubmit)} loading={loading}>
      <TranslatedFormTabs
        onTabChange={onTabChange}
        tab={tab}
        errors={getTranslatedFormTabErrors(form?.formState.errors, TRANSLATED_CMS_FIELDS)}
      />

      {/* translated fields */}
      <Box>
        {locales.map((locale: string, index: number) => (
          <div key={index} css={{ display: locale === tab ? 'block' : 'none' }}>
            <Stack spacing={2}>
              <TextField
                name={locale + ':title'}
                label={t('cms:title')}
                fixedLabel
                type="text"
                variant="outlined"
                required={locale === DEFAULT_LANGUAGE}
                // onFieldChange={onTitleChange}
              />
              <TextEditorField
                name={locale + ':content'}
                label={t('cms:content')}
                // sx={sx.formControl}
                required={locale === DEFAULT_LANGUAGE}
              />
            </Stack>
          </div>
        ))}
      </Box>

      {/* non translated fields */}
      <DropzoneField
        name="bannerImage"
        label={t('cms:bannerImage')}
        inputLabel={t('cms:addBannerImage')}
        maxFiles={1}
        shouldReset={!!article} // can reset input in edition
        helperText={t('common:infoMessages.bannerImageHelper')}
      />
    </Form>
  )
}

export default ArticleForm