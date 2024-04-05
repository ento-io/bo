import { zodResolver } from '@hookform/resolvers/zod';
import { FormControlLabel, Stack, Switch } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AdvancedSearchButton from '@/components/buttons/AdvancedSearchButton';
import Dialog from '@/components/Dialog';
import Form from '@/components/form/Form';

import { useToggle } from '@/hooks/useToggle';

import { EstimateFiltersInput } from '@/types/estimate.types';
import { estimateFilterSchema } from '@/validations/estimate.validation';
import DateRangePickerField from '@/components/form/fields/DateRangePickerField';
import { useAdvancedSearchOptions } from '@/hooks/useAdvancedSearchOptions';

const ESTIMATE_FILTER_FORM_ID = 'estimate-filter';

type Props = {
  onSubmit: (values: any) => void;
};

const EstimateAdvancedFilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { open: isOpenFilterDialog, toggle: toggleOpenFilterDialog } = useToggle();

  const { handleChangeOptions, options } = useAdvancedSearchOptions([
    {
      label: t('common:createdAt'),
      name: 'createdAt',
      checked: false,
      component: <DateRangePickerField name="createdAt" variant="outlined" fullWidth />,
    },
    {
      label: t('common:updatedAt'),
      name: 'updatedAt',
      checked: false,
      component: <DateRangePickerField name="updatedAt" variant="outlined" fullWidth />,
    },
  ]);


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
          <Stack spacing={0}>
            {options.map((option, index) => (
              <div key={option.name + index}>
                <FormControlLabel control={<Switch checked={option.checked} onChange={handleChangeOptions(option.name)} />} label={option.label} />
                {/* display the input when the checkbox is checked */}
                {option.checked && option.component}
              </div>
            ))}
          </Stack>
        </Form>
      </Dialog>
    </>
  );
};

export default EstimateAdvancedFilterForm;
