import { Card, CardContent, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import {  getUserUserSelector } from "@/redux/reducers/user.reducer";
import { getUserFullName } from "@/utils/utils";

const User = () => {
  const user = useSelector(getUserUserSelector);

  return (
    <div className="flexColumn">
      <Card>
        <CardContent>
          <Typography>Name: {getUserFullName(user)}</Typography>
          <Typography>Email: {user.email}</Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default User