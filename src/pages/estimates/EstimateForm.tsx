import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {  useSelector } from 'react-redux';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';
import { EstimateInput } from '@/types/estimate.type';
import { estimateSchema } from '@/validations/estimate.validation';

type Props = {
  formId: string;
  onSubmit: (input: EstimateInput) => void;
};

const EstimateForm = ({ formId, onSubmit }: Props) => {
  const { t } = useTranslation();
  const loading = useSelector(getUserLoadingSelector);
  const appError = useSelector(getAppErrorSelector);

  const form = useForm<EstimateInput>({
    resolver: zodResolver(estimateSchema),
  });

  const { handleSubmit } = form;

  return (
    <Form  
      formId={formId}  
      form={form}  
      onSubmit={handleSubmit(onSubmit)}  
      loading={loading}  
      error={appError}
    >
      <TextField name="url" label={t('url')} type="url" variant="standard" required />
    </Form>
  );
};

export default EstimateForm;
