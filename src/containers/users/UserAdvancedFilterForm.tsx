import { zodResolver } from '@hookform/resolvers/zod';
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

import { accountVerificationOptions, sexOptions, userPlatformOptions } from '@/utils/user.utils';

import { UserFiltersInput } from '@/types/user.type';
import AdvancedSearchFields from '@/components/AdvancedSearchFields';

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
          <AdvancedSearchFields
            fields={[
              {
                label: t('user:lastName'),
                name: 'lastName',
                checked: false,
                component: <TextField name="lastName" variant="standard" placeholder={t('user:lastName')} fullWidth fixedLabel />,
              },
              {
                label: t('user:firstName'),
                name: 'firstName',
                checked: false,
                component: <TextField name="firstName" variant="standard" placeholder={t('user:firstName')} fullWidth fixedLabel />,
              },
              {
                label: t('user:accountVerified'),
                name: 'verified',
                checked: false,
                component: <ToggleButtonsField name="verified" options={accountVerificationOptions} />,
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
                label: t('user:birthday'),
                name: 'birthday',
                checked: false,
                component: <DateRangePickerField name="birthday" variant="standard" fullWidth />,
              },
              {
                label: t('user:sex'),
                name: 'sex',
                checked: false,
                component: <ToggleButtonsField name="sex" options={sexOptions} isMulti />,
              },
              {
                label: t('common:platform'),
                name: 'platform',
                checked: false,
                component: <SelectField name="platform" options={userPlatformOptions} label={t('common:platform')} isMulti isClearable />,
              },
            ]}
          />
        </Form>
      </Dialog>
    </>
  );
};

export default UserAdvancedFilterForm;
