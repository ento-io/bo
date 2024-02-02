import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/auth.action";

const LogOut = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const init = async () => await logout();
    init();
  }, [navigate])

  return null
}

export default LogOut