import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { invoiceSchema } from '@/validations/invoice.validation';
import { IInvoice, InvoiceInput } from '@/types/invoice.type';
import SelectField from '@/components/form/fields/SelectField';
import { IEstimate } from '@/types/estimate.type';
import { ISelectOption } from '@/types/app.type';
import { getEstimateEstimatesSelector } from '@/redux/reducers/estimate.reducer';

const getInitialValues = (invoice: IInvoice | null): InvoiceInput => {
  if (!invoice) {
    return {
      supplierName: '',
      estimate: '',
    };
  }
  return {
    supplierName: invoice.supplierName,
    estimate: invoice.estimate.objectId,
  };
}

const getEstimateOptions = (estimates: IEstimate[]): ISelectOption[] => {
  return estimates.map((estimate: IEstimate) => ({
    label: estimate.reference,
    value: estimate.objectId,
  }));
}



type Props = {
  formId: string;
  onSubmit: (input: InvoiceInput) => void;
  invoice: IInvoice | null;
};

const InvoiceForm = ({ formId, onSubmit, invoice }: Props) => {
  const { t } = useTranslation();
  const estimates = useSelector(getEstimateEstimatesSelector)

  const form = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: getInitialValues(invoice),
  });

  const { handleSubmit } = form;

  return (
    <Form  
      formId={formId}  
      form={form}  
      onSubmit={handleSubmit(onSubmit)}  
    >
      <TextField name="supplierName" label={t('invoices.supplierName')} required fixedLabel />
      <SelectField
        name="estimate"
        options={getEstimateOptions(estimates)}
        label={t('estimates.estimate')}
        isClearable
        isDisabled={!!invoice}
      />
    </Form>
  );
};

export default InvoiceForm;
