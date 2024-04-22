import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { IPage, IPageBlocksInput } from "@/types/page.type"
import Form from "@/components/form/Form";
import { pageBlocksSchema } from "@/validations/page.validations";
import { getPageBlocksEditionCmsInitialValues } from "@/utils/cms.utils";

import CardFormBlock from "@/components/form/CardFormBlock";
import TranslatedPageBlocksField from "./TranslatedPageBlocksField";

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

  const onFormSubmit: SubmitHandler<IPageBlocksInput> = (values) => {
    onSubmit(values);
  };

  return (
    <Form form={form} onSubmit={handleSubmit(onFormSubmit)} loading={loading} isDisabled={false}>
      <CardFormBlock title={t('cms:blocks')} description={t('cms:blocksHelper')}>
        <TranslatedPageBlocksField
          name="blocks"
        />
      </CardFormBlock>
    </Form>
  )
}

export default PageBlocksForm