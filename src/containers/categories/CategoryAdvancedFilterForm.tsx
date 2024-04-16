import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AdvancedSearchButton from '@/components/buttons/AdvancedSearchButton';
import Dialog from '@/components/Dialog';
import Form from '@/components/form/Form';

import { useToggle } from '@/hooks/useToggle';

import DateRangePickerField from '@/components/form/fields/DateRangePickerField';
import TextField from '@/components/form/fields/TextField';
import AdvancedSearchFields from '@/components/AdvancedSearchFields';
import { categoryFilterSchema } from '@/validations/category.validation';
import { CategoryFiltersInput } from '@/types/category.type';
import SelectField from '@/components/form/fields/SelectField';
import { activeOptions, categoryEntityOptions } from '@/utils/cms.utils';
import ToggleButtonsField from '@/components/form/inputs/ToggleButtonsField';

const FILTER_FORM_ID = 'category-filter';

type Props = {
  onSubmit: (values: any) => void;
};

const CategoryAdvancedFilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { open: isOpenFilterDialog, toggle: toggleOpenFilterDialog } = useToggle();

  const form = useForm<CategoryFiltersInput>({
    resolver: zodResolver(categoryFilterSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<CategoryFiltersInput> = async values => {
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
        formId={FILTER_FORM_ID}>
        <Form formId={FILTER_FORM_ID} form={form} onSubmit={handleSubmit(onSubmitHandler)}>
          <AdvancedSearchFields
            fields={[
              {
                label: t('cms:category.categoryFor'),
                name: 'entity',
                checked: false,
                component: (
                  <SelectField
                    name="entity"
                    options={categoryEntityOptions}
                    variant="standard"
                    isClearable
                  />
                ),
              },
              {
                label: t('common:active'),
                name: 'active',
                checked: false,
                component: (
                  <ToggleButtonsField name="active" options={activeOptions} isMulti />
                ),
              },
              {
                label: t('common:createdAt'),
                name: 'createdAt',
                checked: false,
                component: <DateRangePickerField name="createdAt" variant="standard" fullWidth />,
              },
              {
                label: t('common:updatedAt'),
                name: 'updatedAt',
                checked: false,
                component: <DateRangePickerField name="updatedAt" variant="standard" fullWidth />,
              },
              {
                label: t('common:user'),
                name: 'user',
                checked: false,
                component: <TextField name="user" placeholder={t('user:nameOrEmail')} variant="standard" fullWidth />,
              },
            ]}
          />
        </Form>
      </Dialog>
    </>
  );
};

export default CategoryAdvancedFilterForm;
