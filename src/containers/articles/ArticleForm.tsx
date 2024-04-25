import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";
import { IArticle, IArticleInput } from "@/types/article.type"
import TextField from "@/components/form/fields/TextField";
import Form from "@/components/form/Form";
import { articleSchema } from "@/validations/article.validations";
import TextEditorField from "@/components/form/fields/TextEditorField";
import { getTranslatedFormTabErrors } from "@/utils/utils";
import { TRANSLATED_CMS_FIELDS, getCmsEditionCmsInitialValues } from "@/utils/cms.utils";
import LanguageTabs from "@/components/form/translated/TranslatedFormTabs";
import { getSettingsLangSelector } from "@/redux/reducers/settings.reducer";
import { locales } from "@/config/i18n";
import { DEFAULT_LANGUAGE } from "@/utils/constants";
import DropzoneField from "@/components/form/dropzone/DropzoneField";
import CardFormBlock from "@/components/form/CardFormBlock";
import CheckboxField from "@/components/form/fields/CheckboxField";
import { CategoryEntityEnum } from "@/types/category.type";
import { useTranslatedValuesByTab } from "@/hooks/useTranslatedValuesByTab";
import CategoriesSearchByEntityField from "../categories/CategoriesSearchByEntityField";
import TranslatedSlugField from "../cms/TranslatedSlugField";

const initialValues = {
  active: true,
  categories: []
};

type Props = {
  onSubmit: (values: IArticleInput) => void;
  article?: IArticle | null;
  loading?: boolean;
}

const ArticleForm = ({ onSubmit, article, loading }: Props) => {
  const language = useSelector(getSettingsLangSelector);

  // get translated fields depending on the selected language (tabs)
  const { onTabChange, tab } = useTranslatedValuesByTab();

  const form = useForm<IArticleInput>({
    defaultValues: initialValues,
    resolver: zodResolver(articleSchema),
  });

  const { handleSubmit, reset, setValue } = form;

  useEffect(() => {
    if (!article) return;
    const init = async () => {
      const editionInitialValues = await getCmsEditionCmsInitialValues(article, language);
      reset(editionInitialValues)
    };

    init();
  }, [article, reset, language]);

  // change translated slug field value when title is changed
  const handleTitleChange = (value: string | number) => {
    setValue(tab + ':slug', value, { shouldValidate: true });
  };

  const onFormSubmit: SubmitHandler<IArticleInput> = (values) => {
    onSubmit(values);
    reset(initialValues);
  };

  return (
    <Form form={form} onSubmit={handleSubmit(onFormSubmit)} loading={loading}>
      {/* translated fields */}
      <CardFormBlock title={t('details')} description={t('cms:translatedFields')}>
        {/* translated tabs */}
        <LanguageTabs
          onTabChange={onTabChange}
          tab={tab}
          errors={getTranslatedFormTabErrors(form?.formState.errors, TRANSLATED_CMS_FIELDS)}
        />
        {/* all translated fields */}
        {locales.map((locale: string, index: number) => (
          <div key={index} css={{ display: locale === tab ? 'block' : 'none', marginTop: 12 }}>
            <Stack spacing={2}>
              <TextField
                name={locale + ':title'}
                label={t('cms:title')}
                fixedLabel
                type="text"
                variant="outlined"
                required={locale === DEFAULT_LANGUAGE}
                onFieldChange={handleTitleChange}
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

      {/* active card */}
      <CardFormBlock
        title={t('common:active')}
        description={t('cms:activePageVisible')}
        rightHeader={<CheckboxField name="active" isSwitch />}
      />
      <CardFormBlock title={t('cms:category.category')}>
        <CategoriesSearchByEntityField
          entity={CategoryEntityEnum.Article}
          multiple
          name="categories"
          label={t('cms:category.categories')}
          fullWidth
        />
      </CardFormBlock>

      {/* images card */}
      <CardFormBlock title={t('images')}>
        <Stack spacing={2}>
          {/* non translated fields */}
          <DropzoneField
            name="bannerImage"
            label={t('cms:bannerImage')}
            inputLabel={t('cms:addBannerImage')}
            maxFiles={1}
            shouldReset={!!article} // can reset input in edition
            helperText={t('common:infoMessages.bannerImageHelper')}
            type="image"
          />
          <DropzoneField
            name="previewImage"
            label={t('common:previewImage')}
            inputLabel={`${t('common:add')} ${t('common:previewImage')}`}
            maxFiles={1}
            shouldReset={!!article} // can reset input in edition
            helperText={t('common:infoMessages.previewImageHelper')}
            type="image"
          />
          {/* multiple image upload */}
          <DropzoneField
            name="images"
            label={t('common:images')}
            inputLabel={t('images')}
            maxFiles={5}
            shouldReset={!!article} // can reset input in edition
            type="image"
          />
        </Stack>
      </CardFormBlock>
    </Form>
  )
}

export default ArticleForm