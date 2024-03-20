import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {  useSelector } from 'react-redux';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';
import { InvoiceInput } from '@/types/invoice.type';
import { invoiceSchema } from '@/validations/invoice.validation';

type Props = {
  formId: string;
  onSubmit: (input: InvoiceInput) => void;
};

const InvoiceForm = ({ formId, onSubmit }: Props) => {
  const { t } = useTranslation();
  const loading = useSelector(getUserLoadingSelector);
  const appError = useSelector(getAppErrorSelector);

  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
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
      <TextField name="supplierName" label={t('supplierName')} type="supplierName" variant="standard" required />
    </Form>
  );
};

export default InvoiceForm;
