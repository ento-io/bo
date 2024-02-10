import { useMemo } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

import SelectField from '@/components/form/fields/SelectField';
import Form from '@/components/form/Form';

import { getRoleRolesSelector } from '@/redux/reducers/role.reducer';

import { rolesForUserSchema } from '@/validations/role.validations';

import { ISelectOption } from '@/types/app.type';
import { RolesForUserInput, IRole } from '@/types/role.type';

type Props = {
  onSubmit: (values: RolesForUserInput) => void;
  userRoles?: IRole[];
  formId: string;
};

const RoleForUserForm = ({ onSubmit, userRoles, formId }: Props) => {
  // all roles to select
  const roles = useSelector(getRoleRolesSelector);

  const form = useForm<RolesForUserInput>({
    resolver: zodResolver(rolesForUserSchema),
  });

  const { handleSubmit } = form;

  const onSubmitHandler: SubmitHandler<RolesForUserInput> = async values => {
    onSubmit(values);
  };

  const options = useMemo(() => {
    if (userRoles) {
      return roles
        .filter((role: IRole): boolean => !userRoles.map((userRole: IRole) => userRole.name).includes(role.name)) // roles other than the current user roles
        .map((role: IRole): ISelectOption => ({ value: role.name, label: role.name }));
    }

    return roles.map((role: IRole): ISelectOption => ({ value: role.name, label: role.name }));
  }, [userRoles, roles]);

  return (
    <Form formId={formId} form={form} onSubmit={handleSubmit(onSubmitHandler)}>
      <SelectField name="roles" options={options} isMulti />
    </Form>
  );
};

export default RoleForUserForm;
