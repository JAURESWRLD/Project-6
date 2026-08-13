import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/hooks/useAuth";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();            // supprime le token et l’utilisateur
    navigate("/login");  // redirige automatiquement vers la page de login
  }, [logout, navigate]);

  return (
    <div>
      <p>Déconnexion en cours...</p>
    </div>
  );
};

export default Logout;
