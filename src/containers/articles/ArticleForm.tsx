import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";
import { debounce } from "lodash";
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
import CardFormBlock from "@/components/form/CardFormBlock";
import CheckboxField from "@/components/form/fields/CheckboxField";
import AutocompleteField from "@/components/form/fields/AutocompleteField";
import { searchCategoriesForAutocomplete } from "@/redux/actions/category.action";
import { getTranslatedField } from "@/utils/settings.utils";
import { ISelectOption } from "@/types/app.type";

const initialValues = {
  title: '',
  content: '',
  active: true,
  categories: []
};

type ICategoryOptionValue = {
  objectId: string;
}
type ICategoryOption = ISelectOption<ICategoryOptionValue>;

type Props = {
  onSubmit: (values: IArticleInput) => void;
  article?: IArticle | null;
  loading?: boolean;
}

const ArticleForm = ({ onSubmit, article, loading }: Props) => {
  const [categoryOptions, setCategoryOptions] = useState<ICategoryOption[]>([]);
  const [categoryOptionsLoading, setCategoryOptionsLoading] = useState<boolean>(false);

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

      const editionInitialValues = await getCmsEditionCmsInitialValues(article, language);
      reset(editionInitialValues)
    };

    init();
  }, [article, reset, language]);

  const onFormSubmit: SubmitHandler<IArticleInput> = (values) => {
    onSubmit(values);
    reset(initialValues);
  }

  const handleSearchCategory = debounce(async (search: string) => {
    setCategoryOptionsLoading(true);
    const categories = await searchCategoriesForAutocomplete(search) || [];
    const newOptions = categories.map((category: any) => ({
      value: {
        objectId: category.objectId,
      },
      label: getTranslatedField(category.translated, language, 'name')
    }));
    setCategoryOptions(newOptions);
    setCategoryOptionsLoading(false);
  }, 500)

  const onTabChange = (value: Lang) => setTab(value);

  return (
    <Form form={form} onSubmit={handleSubmit(onFormSubmit)} loading={loading}>
      {/* translated fields */}
      <CardFormBlock title={t('details')} description={t('cms:translatedFields')}>
        {/* translated tabs */}
        <TranslatedFormTabs
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
      </CardFormBlock>

      {/* active card */}
      <CardFormBlock
        title={t('common:active')}
        description={t('cms:activePageVisible')}
        rightHeader={<CheckboxField name="active" isSwitch />}
      />
      <CardFormBlock title={t('common:seo')}>
        <AutocompleteField<ICategoryOptionValue>
          name="categories"
          label="Categories"
          disableNoOptions
          loading={categoryOptionsLoading}
          options={categoryOptions}
          fullWidth
          onSearch={handleSearchCategory}
          multiple
          // withPreview
          // renderPreviews={(previews: ISelectOption<ICategoryOptionValue>[], onDelete?: (id: string) => void) =>
          //   previews.map((preview: any, index: number) => {
          //     console.log('preview: ', preview);
          //     return (
          //       // <Stack key={(preview.label as string) + index} spacing={2} className="flex1">
          //       //   <Card>
          //       //     <button
          //       //         className="flexCenter stretchSelf transparentButton"
          //       //         onClick={() => onDelete?.(preview.value.objectId)}>
          //       //         Delete
          //       //       </button>
          //       //     <span>{preview.label}x</span>
          //       //   </Card>
          //       // </Stack>
          //     )
          //   })
          // }
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
          />
          <DropzoneField
            name="previewImage"
            label={t('common:previewImage')}
            inputLabel={`${t('common:add')} ${t('common:previewImage')}`}
            maxFiles={1}
            shouldReset={!!article} // can reset input in edition
            tooltip={t('common:infoMessages.previewImageHelper')}
          />
          {/* multiple image upload */}
          <DropzoneField
            name="images"
            label={t('common:images')}
            inputLabel={t('images')}
            maxFiles={5}
            shouldReset={!!article} // can reset input in edition
          />
        </Stack>
      </CardFormBlock>
    </Form>
  )
}

export default ArticleForm