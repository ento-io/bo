import { useEffect, useState } from "react";
import Parse from "parse";

import { Typography } from "@mui/material";

import { getUserFullName } from "@/utils/utils";
import { getCurrentUser } from "@/actions/auth.action";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<Parse.User | undefined>(undefined)

  // load initial article list
  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.log('error: ', error);
      }
    }
    
    init();
  }, [])

  if (!currentUser) return null;

  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      <Typography>Name: {getUserFullName(currentUser)} </Typography>
      <Typography>Email: {currentUser.get("email")} </Typography>
    </div>
  )
}

export default Profile