import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/"); // Redirection après déconnexion
    localStorage.setItem("logoutMessage", "❌ Vous avez été déconnecté.");
  }, [logout, navigate]);

  return null;
};

export default Logout;