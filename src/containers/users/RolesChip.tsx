import { Chip, Stack } from '@mui/material';
import { green, indigo, orange } from '@mui/material/colors';

import { HIGHEST_LEVEL_DEFAULT_ROLES } from '@/utils/constants';

import { IRole } from '@/types/role.type';

const colors = [indigo[400], green[400], orange[400]];

type Props = {
  roles: IRole[];
  onRemove?: (role: IRole) => void;
  spacing?: number;
};

const RolesChip = ({ roles, onRemove, spacing = 1 }: Props) => {
  if (!roles) {
    return null;
  }

  return (
    <Stack direction="row" spacing={spacing}>
      {roles.map((role: IRole, index: number) => (
        <Chip
          label={role.name}
          sx={{
            backgroundColor: role.name === HIGHEST_LEVEL_DEFAULT_ROLES[1] ? colors[index + 1] : colors[index],
          }}
          key={index}
          onDelete={onRemove ? () => onRemove(role) : undefined}
        />
      ))}
    </Stack>
  );
};

export default RolesChip;
