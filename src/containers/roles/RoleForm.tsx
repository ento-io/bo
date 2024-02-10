import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import RightsTableField from '@/components/form/fields/RightsTableField';
import SelectField from '@/components/form/fields/SelectField';
import TextField from '@/components/form/fields/TextField';
import Form from '@/components/form/Form';

import { roleSchema } from '@/validations/role.validations';

import { ENTITIES_WITH_RIGHTS_OPTIONS, defaultRights } from '@/utils/role.utils';

import { IRightsItem, IRoleInput, IRole } from '@/types/role.type';

const getInitialValues = (selectedRole: IRole) => {
  if (selectedRole) {
    const rightsWithLabel = [];

    for (const rightOption of ENTITIES_WITH_RIGHTS_OPTIONS) {
      const savedRight = selectedRole.rights?.find(
        (right: IRightsItem): boolean => right.className === rightOption.className,
      );

      // rights from database
      if (savedRight) {
        // add label
        const savedRightWithLabel = { ...savedRight, label: rightOption.label };
        rightsWithLabel.push(savedRightWithLabel);
        // collection not linked to a role / rights yet
      } else {
        // add label
        const notSavedRight = { ...rightOption, rights: defaultRights, label: rightOption.label };
        rightsWithLabel.push(notSavedRight);
      }
    }

    return {
      name: selectedRole.name,
      children: selectedRole.children || [],
      rights: rightsWithLabel,
    };
  }

  return {
    name: '',
    children: [],
    rights: ENTITIES_WITH_RIGHTS_OPTIONS.map((className: Omit<IRightsItem, 'rights'>) => ({
      ...className,
      rights: defaultRights,
    })),
  };
};
type Props = {
  formId: string;
  selectedRole?: IRole | null;
  roles: IRole[];
  onSubmit: (values: IRoleInput) => void;
};

const RoleForm = ({ formId, selectedRole, onSubmit, roles }: Props) => {
  const { t } = useTranslation(['common', 'user']);

  const form = useForm<IRoleInput>({
    resolver: zodResolver(roleSchema),
    defaultValues: getInitialValues(selectedRole as IRole),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<IRoleInput> = async values => {
    onSubmit(values);
  };

  const options = roles
    .filter((role: IRole) => form.getValues().name !== role.name)
    .map((role: IRole) => ({ value: role.name, label: role.name }));

  return (
    <Form formId={formId} form={form} onSubmit={handleSubmit(onSubmitHandler)}>
      <TextField
        autoFocus
        name="name"
        label={t('common:name')}
        type="text"
        variant="standard"
        required
        helperText={'ex: Manager. ' + t('user:role.onceCreate')}
        // disable name field in edition because the role can not be modified after it's created
        // https://github.com/parse-community/parse-server/issues/6161
        disabled={!!selectedRole}
      />
      <SelectField
        name="children"
        options={options}
        isMulti
        label={t('user:role.roleHierarchy')}
        helperText={t('user:role.roleHierarchyExplanation')}
      />
      <RightsTableField label="Rights" name="rights" />
    </Form>
  );
};

export default RoleForm;
