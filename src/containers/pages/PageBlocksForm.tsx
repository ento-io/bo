import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { IPage, IPageBlocksInput } from "@/types/page.type"
import Form from "@/components/form/Form";
import { pageBlocksSchema } from "@/validations/page.validations";
import { getPageBlocksEditionCmsInitialValues } from "@/utils/cms.utils";

import CardFormBlock from "@/components/form/CardFormBlock";
import TranslatedPageBlocksField from "./TranslatedPageBlocksField";
import { goToPage } from "@/redux/actions/page.action";

const initialValues = {
  blocks: [{
    name: ''
  }],
};

type Props = {
  onSubmit: (values: IPageBlocksInput) => void;
  page?: IPage | null;
  loading?: boolean;
}

const PageBlocksForm = ({ onSubmit, page, loading }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<IPageBlocksInput>({
    defaultValues: initialValues,
    resolver: zodResolver(pageBlocksSchema),
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

  const handleGoToPage = () => {
    if (!page) return;
    navigate(goToPage(page.objectId))
  };

  const onFormSubmit: SubmitHandler<IPageBlocksInput> = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit(onFormSubmit)}
      loading={loading}
      isDisabled={false}
      buttonDirection="row"
      secondaryButtonText={t('common:ignore')}
      onSecondaryButtonClick={handleGoToPage}
    >
      <CardFormBlock title={t('cms:blocks')} description={t('cms:blocksHelper')}>
        <TranslatedPageBlocksField
          name="blocks"
        />
      </CardFormBlock>
    </Form>
  )
}

export default PageBlocksForm