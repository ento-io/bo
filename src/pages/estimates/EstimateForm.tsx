import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useId } from 'react';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';
import { EstimateInput } from '@/types/estimate.type';
import { estimateSchema } from '@/validations/estimate.validation';
import { createEstimate } from '@/redux/actions/estimate.action';

type Props = {
  formId: string;
  onSubmit: (input: EstimateInput) => void;
};

const EstimateForm = ({ formId, onSubmit }: Props) => {
  const { t } = useTranslation();
  const loading = useSelector(getUserLoadingSelector);
  const appError = useSelector(getAppErrorSelector);
  const dispatch = useDispatch();
  const uid = useId();

  const form = useForm<EstimateInput>({
    resolver: zodResolver(estimateSchema),
  });

  const { handleSubmit } = form;

  // const handleAdd = () => {
  //   const values = { title: `Article ${uid}` };
  //   dispatch(createArticle(values));
  // }


  const onSubmitHandler: SubmitHandler<EstimateInput> = async values => {
    await onSubmit(values);
    dispatch(createEstimate({ url: `Estimate ${uid}` }));
  };

  return (
    <Form  
      formId={formId}  
      form={form}  
      onSubmit={handleSubmit(onSubmitHandler)}  
      loading={loading}  
      error={appError}
    >
      <TextField name="url" label={t('url')} type="url" variant="standard" required />
    </Form>
  );
};

export default EstimateForm;
