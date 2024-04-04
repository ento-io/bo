import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AdvancedSearchButton from '@/components/buttons/AdvancedSearchButton';
import Dialog from '@/components/Dialog';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { useToggle } from '@/hooks/useToggle';

import { EstimateFiltersInput } from '@/types/estimate.types';
import { estimateFilterSchema } from '@/validations/estimate.validation';

const ESTIMATE_FILTER_FORM_ID = 'estimate-filter';

type Props = {
  onSubmit: (values: any) => void;
};
const EstimateAdvancedFilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { open: isOpenFilterDialog, toggle: toggleOpenFilterDialog } = useToggle();

  const form = useForm<EstimateFiltersInput>({
    resolver: zodResolver(estimateFilterSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<EstimateFiltersInput> = async values => {
    onSubmit(values);
    toggleOpenFilterDialog();
    form.reset();
  };

  return (
    <>
      <AdvancedSearchButton onClick={toggleOpenFilterDialog} />
      <Dialog
        maxWidth="sm"
        fullWidth
        title={t('advancedSearch')}
        primaryButtonText={t('search')}
        open={isOpenFilterDialog}
        toggle={toggleOpenFilterDialog}
        formId={ESTIMATE_FILTER_FORM_ID}>
        <Form formId={ESTIMATE_FILTER_FORM_ID} form={form} onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack direction="row" spacing={2}>
            <TextField name="url" label={t('common:link')} type="text" variant="outlined" fullWidth fixedLabel />
          </Stack>
        </Form>
      </Dialog>
    </>
  );
};

export default EstimateAdvancedFilterForm;
