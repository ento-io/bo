import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import Avatar from '@/components/Avatar';

import { getUserFullName } from '@/utils/user.utils';

import { IUser } from '@/types/user.type';

type Props = {
  user: IUser;
};

const UserCell = ({ user }: Props) => {
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemAvatar>
        <Avatar user={user} size={42} />
      </ListItemAvatar>
      <ListItemText primary={getUserFullName(user)} secondary={user.username} />
    </ListItem>
  );
};

export default UserCell;
