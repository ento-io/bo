import { Card } from "@mui/material";
import { Outlet } from "@tanstack/react-router";

const classes = {
  root: {
    minHeight: '100vh'
  }
}
const AuthLayout = () => {
  return (
    <div css={classes.root} className="flexCenter">
       <Card sx={{ minWidth: 400 }} css={{ padding: 26 }} className="flexCenter">
          <Outlet />
       </Card>
    </div>
  );
}

export default AuthLayout