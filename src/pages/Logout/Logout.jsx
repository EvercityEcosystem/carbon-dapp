import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { forgetCurrentUser } from "../../utils/storage";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    forgetCurrentUser();
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;
