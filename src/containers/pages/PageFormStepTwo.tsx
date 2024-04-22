import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { t } from "i18next";
import { Stack } from "@mui/material";
import { IPage, IPageStepTwoInput } from "@/types/page.type"
import Form from "@/components/form/Form";
import { pageStepTwoSchema } from "@/validations/page.validations";
import { getPageStepTwoEditionInitialValues } from "@/utils/cms.utils";
import DropzoneField from "@/components/form/dropzone/DropzoneField";
import CardFormBlock from "@/components/form/CardFormBlock";

type Props = {
  onSubmit: (values: IPageStepTwoInput) => void;
  page?: IPage | null;
  loading?: boolean;
  buttonText?: string;
}

const PageFormStepTwo = ({ onSubmit, page, loading, buttonText }: Props) => {
  const form = useForm<IPageStepTwoInput>({
    resolver: zodResolver(pageStepTwoSchema),
  });

  const { handleSubmit, reset } = form;

  // initialize form values
  useEffect(() => {
    if (!page) return;
    const init = async () => {
      const editionInitialValues = await getPageStepTwoEditionInitialValues(page);
      reset(editionInitialValues)
    };

    init();
  }, [page, reset]);

  const onFormSubmit: SubmitHandler<IPageStepTwoInput> = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      onSubmit={handleSubmit(onFormSubmit)}
      loading={loading}
      isDisabled={false}
      primaryButtonText={buttonText}
    >
      <CardFormBlock title={t('images')}>
        <Stack spacing={2}>
          {/* non translated fields */}
          <DropzoneField
            name="bannerImage"
            label={t('cms:bannerImage')}
            inputLabel={t('cms:addBannerImage')}
            maxFiles={1}
            shouldReset={!!page} // can reset input in edition
            helperText={t('common:infoMessages.bannerImageHelper')}
            type="image"
          />
          <DropzoneField
            name="previewImage"
            label={t('common:previewImage')}
            inputLabel={`${t('common:add')} ${t('common:previewImage')}`}
            maxFiles={1}
            shouldReset={!!page} // can reset input in edition
            helperText={t('common:infoMessages.previewImageHelper')}
            type="image"
          />
          {/* multiple image upload */}
          <DropzoneField
            name="images"
            label={t('common:images')}
            inputLabel={t('images')}
            maxFiles={5}
            shouldReset={!!page} // can reset input in edition
            type="image"
          />
        </Stack>
      </CardFormBlock>
    </Form>
  )
}

export default PageFormStepTwo