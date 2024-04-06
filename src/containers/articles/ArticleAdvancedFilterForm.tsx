import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AdvancedSearchButton from '@/components/buttons/AdvancedSearchButton';
import Dialog from '@/components/Dialog';
import Form from '@/components/form/Form';

import { useToggle } from '@/hooks/useToggle';

import { ArticleFiltersInput } from '@/types/article.types';
import { articleFilterSchema } from '@/validations/article.validations';
import DateRangePickerField from '@/components/form/fields/DateRangePickerField';
import TextField from '@/components/form/fields/TextField';
import AdvancedSearchFields from '@/components/AdvancedSearchFields';

const ESTIMATE_FILTER_FORM_ID = 'article-filter';

type Props = {
  onSubmit: (values: any) => void;
};

const ArticleAdvancedFilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { open: isOpenFilterDialog, toggle: toggleOpenFilterDialog } = useToggle();

  const form = useForm<ArticleFiltersInput>({
    resolver: zodResolver(articleFilterSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<ArticleFiltersInput> = async values => {
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
          <AdvancedSearchFields
            fields={[
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

export default ArticleAdvancedFilterForm;