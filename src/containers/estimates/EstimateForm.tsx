import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { EstimateInput, IEstimate } from '@/types/estimate.type';
import { estimateSchema } from '@/validations/estimate.validation';

const getInitialValues = (estimate: IEstimate | null): EstimateInput => {
  if (!estimate) {
    return {
      url: '',
    };
  }
  return {
    url: estimate.url,
  };
}
type Props = {
  formId: string;
  onSubmit: (input: EstimateInput) => void;
  estimate: IEstimate | null;
};

const EstimateForm = ({ formId, onSubmit, estimate }: Props) => {
  const { t } = useTranslation();

  const form = useForm<EstimateInput>({
    resolver: zodResolver(estimateSchema),
    defaultValues: getInitialValues(estimate),
  });

  const { handleSubmit } = form;

  return (
    <Form  
      formId={formId}  
      form={form}  
      onSubmit={handleSubmit(onSubmit)}  
    >
      <TextField name="url" label={t('url')} type="url" required />
    </Form>
  );
};

export default EstimateForm;
