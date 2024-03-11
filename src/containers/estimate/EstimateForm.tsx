import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Box } from '@mui/material';
import Form from '@/components/form/Form';

import { getAppErrorSelector } from '@/redux/reducers/app.reducer';
import { getUserLoadingSelector } from '@/redux/reducers/user.reducer';

import { IEstimateInput } from '@/types/estimate.types';
import { estimateSchema } from '@/validations/estimate.validation';
import TextField from '@/components/form/fields/TextField';


type Props = {
  formId: string;
  onSubmit: () => void;
};

const EstimateForm = ( { formId, onSubmit } : Props ) => {
  const { t } = useTranslation(['user']);
  const loading = useSelector(getUserLoadingSelector);
  const error = useSelector(getAppErrorSelector);


  const form = useForm<IEstimateInput>({
    resolver: zodResolver(estimateSchema)
  });

  return (
    <Box sx={{ mt: 3 }}>
         <Form
            form={form}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            isDisabled={true}
            formId={formId}
            >
          <TextField
            autoFocus
            name="estimation"
            placeholder={t('pasteUrlHere')}
            type="text"
            variant="outlined"
            required
            errorMessage={error}
          />
      </Form>
    </Box>
       
);
};

export default EstimateForm;
