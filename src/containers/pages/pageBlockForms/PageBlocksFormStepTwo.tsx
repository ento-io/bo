import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslation } from "react-i18next";
import { IPage, IPageBlocksStepTwoInput } from "@/types/page.type"
import Form, { IFormProps } from "@/components/form/Form";
import { pageBlocksStepTwoSchema } from "@/validations/page.validations";
import { getPageBlocksEditionCmsInitialValues } from "@/utils/cms.utils";

import CardFormBlock from "@/components/form/CardFormBlock";
import TranslatedPageBlocksField from "./TranslatedPageBlocksField";

const initialValues = {
  blocks: [{
    name: ''
  }],
};

type Props = {
  onSubmit: (values: IPageBlocksStepTwoInput) => void;
  page?: IPage | null;
  loading?: boolean;
} & Pick<IFormProps, 'buttonDirection' | 'onSecondaryButtonClick' | 'primaryButtonText' | 'secondaryButtonText'>;

const PageBlocksFormStepTwo = ({ onSubmit, page, loading, ...formProps }: Props) => {
  // const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<IPageBlocksStepTwoInput>({
    defaultValues: initialValues,
    resolver: zodResolver(pageBlocksStepTwoSchema),
  });

  const { handleSubmit, reset } = form;

  // initialize form values
  useEffect(() => {
    if (!page) return;
    const init = async () => {
      const editionInitialValues = await getPageBlocksEditionCmsInitialValues(page);
      reset(editionInitialValues)
    };

    init();
  }, [page, reset]);

  // const handleGoToPage = () => {
  //   if (!page) return;
  //   navigate(goToPage(page.objectId))
  // };

  const onFormSubmit: SubmitHandler<IPageBlocksStepTwoInput> = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit(onFormSubmit)}
      loading={loading}
      isDisabled={false}
      {...formProps}

      // buttonDirection="row"
      // secondaryButtonText={t('common:ignore')}
      // onSecondaryButtonClick={handleGoToPage}
    >
      <CardFormBlock title={t('cms:blocks')} description={t('cms:blocksHelper')}>
        <TranslatedPageBlocksField
          name="blocks"
        />
      </CardFormBlock>
    </Form>
  )
}

export default PageBlocksFormStepTwo;