import { useEffect } from "react";
import { logout } from "@/actions/auth.action";
import { useNavigate } from "@tanstack/react-router";

const LogOut = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const init = async () => {
      await logout();
      navigate({ to: "/login" })
    };
    init();
  }, [navigate])

  return null
}

export default LogOut