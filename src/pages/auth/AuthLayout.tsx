import { Card } from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import Logo from "@/components/Logo";

const classes = {
  root: {
    minHeight: '100vh'
  }
}
const AuthLayout = () => {
  return (
    <div css={classes.root} className="flexCenter">
        <div css={{ paddingBottom: 40} }>
          <Logo />
        </div>
       <Card css={{ minWidth: 400, padding: 26 }} className="flexCenter">
          <Outlet />
       </Card>
    </div>
  );
}

export default AuthLayout