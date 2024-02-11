import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiEye } from "react-icons/fi";

import { IconButton } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import { getUserFullName } from '@/utils/user.utils';
import { getUserUsersSelector } from '@/redux/reducers/user.reducer';
import { IUser } from '@/types/user.type';
import { goToUser } from '@/redux/actions/user.action';

const Users = () => {
  const navigate = useNavigate();
  const users = useSelector(getUserUsersSelector);

  const handleGoToUser = (id: string) => {
    navigate(goToUser(id))
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: IUser, index: number) => (
              <TableRow
                key={user.id + index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {getUserFullName(user)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.email}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="info" onClick={() => handleGoToUser(user.objectId)}>
                    <FiEye />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Users;
