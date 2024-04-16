import { useSelector } from "react-redux";
import { useMemo } from "react";
import { getRoleCurrentUserRolesSelector } from "@/redux/reducers/role.reducer";
import { canAccessTo } from "@/utils/role.utils";

type Output = {
  canPreview: boolean;
  canDelete: boolean;
  canCreate: boolean;
  canFind: boolean;
};
export const useProtect = (className: string): Output => {
  const roles = useSelector(getRoleCurrentUserRolesSelector);

  const protections = useMemo(() => {
    return {
      canPreview: canAccessTo(roles, className, 'get'),
      canDelete: canAccessTo(roles, className, 'delete'),
      canCreate: canAccessTo(roles, className, 'create'),
      canFind: canAccessTo(roles, className, 'find'),
    };
  }, [roles, className])

  return protections
}