import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { useSelector } from "react-redux";
import { IPage, IPageStepThreeInput } from "@/types/page.type"
import Form, { IFormProps } from "@/components/form/Form";
import { pageStepThreeSchema } from "@/validations/page.validations";
import { getPageStepThreeEditionInitialValues, pageLinkLocationOptions } from "@/utils/cms.utils";
import { getSettingsLangSelector } from "@/redux/reducers/settings.reducer";
import CardFormBlock from "@/components/form/CardFormBlock";
import CheckboxField from "@/components/form/fields/CheckboxField";
import { CategoryEntityEnum } from "@/types/category.type";
import CategoriesSearchByEntityField from "../../categories/CategoriesSearchByEntityField";
import SelectField from "@/components/form/fields/SelectField";

const initialValues = {
  active: true,
  categories: [],
};

type Props = {
  onSubmit: (values: IPageStepThreeInput) => void;
  page?: IPage | null;
  loading?: boolean;
} & Pick<IFormProps, 'buttonDirection' | 'onSecondaryButtonClick' | 'primaryButtonText' | 'secondaryButtonText'>;

const PageFormStepThree = ({ onSubmit, page, loading, ...formProps }: Props) => {
  const language = useSelector(getSettingsLangSelector);

  const form = useForm<IPageStepThreeInput>({
    defaultValues: initialValues,
    resolver: zodResolver(pageStepThreeSchema),
  });

  const { handleSubmit, reset } = form;

  // initialize form values
  useEffect(() => {
    if (!page) return;
    const init = async () => {
      const editionInitialValues = await getPageStepThreeEditionInitialValues(page, language);
      reset(editionInitialValues)
    };

    init();
  }, [page, reset, language]);

  const onFormSubmit: SubmitHandler<IPageStepThreeInput> = (values) => {
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
      {/* active card */}
      <CardFormBlock
        title={t('common:active')}
        description={t('cms:activePageVisible')}
        rightHeader={<CheckboxField name="active" isSwitch />}
      />
      <CardFormBlock title={t('cms:category.category')}>
        <CategoriesSearchByEntityField
          entity={CategoryEntityEnum.Page}
          multiple={false}
          name="category"
          label={t('cms:category.category')}
          fullWidth
          isSearch
        />
      </CardFormBlock>

      <CardFormBlock title={t('cms:linkLocation')}>
        <SelectField
          name="linkLocations"
          options={pageLinkLocationOptions}
          variant="outlined"
          isClearable
          isMulti
        />
      </CardFormBlock>
    </Form>
  )
}

export default PageFormStepThree