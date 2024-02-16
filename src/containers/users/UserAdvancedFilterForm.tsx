import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AdvancedSearchButton from '@/components/buttons/AdvancedSearchButton';
import Dialog from '@/components/Dialog';
import DateRangePickerField from '@/components/form/fields/DateRangePickerField';
import SelectField from '@/components/form/fields/SelectField';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';
import ToggleButtonsField from '@/components/form/inputs/ToggleButtonsField';

import { useToggle } from '@/hooks/useToggle';

import { userFilterSchema } from '@/validations/user.validation';

import { sexOptions, userPlatformOptions } from '@/utils/user.utils';

import { UserFiltersInput } from '@/types/user.type';

const USER_FILTER_FORM_ID = 'user-filter';

type Props = {
  onSubmit: (values: any) => void;
};
const UserAdvancedFilterForm = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { open: isOpenFilterDialog, toggle: toggleOpenFilterDialog } = useToggle();

  const form = useForm<UserFiltersInput>({
    resolver: zodResolver(userFilterSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<UserFiltersInput> = async values => {
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
        formId={USER_FILTER_FORM_ID}>
        <Form formId={USER_FILTER_FORM_ID} form={form} onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack direction="row" spacing={2}>
            <TextField name="lastName" label={t('user:lastName')} type="text" variant="outlined" fullWidth fixedLabel />
            <TextField
              name="firstName"
              label={t('user:firstName')}
              type="text"
              variant="outlined"
              fullWidth
              fixedLabel
            />
          </Stack>
          <TextField name="email" label={t('user:email')} type="text" variant="outlined" fullWidth fixedLabel />
          <ToggleButtonsField name="sex" options={sexOptions} label={t('user:sex')} isMulti />
          <DateRangePickerField name="birthday" label={t('user:birthday')} variant="outlined" />
          <SelectField name="platform" options={userPlatformOptions} label={t('common:platform')} isMulti isClearable />
          {/* <ToggleButtonsField name="isOnline" options={onlineOptions} label={t('user:online') + ' ?'} isMulti /> */}
        </Form>
      </Dialog>
    </>
  );
};

export default UserAdvancedFilterForm;
