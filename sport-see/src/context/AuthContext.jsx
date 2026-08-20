import { useState } from "react";
import { AuthContext } from "./AuthContextValue";

const SESSION_STORAGE_KEYS = {
  user: "sportsee_user",
};

const readStoredUser = () => {
  try {
    const savedUser = sessionStorage.getItem(SESSION_STORAGE_KEYS.user);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Erreur lors de la lecture du profil utilisateur :", error);
    return null;
  }
};

const readStoredToken = () => readStoredUser()?.token || null;

const isTokenUsable = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(window.atob(token.split(".")[1]));
    return typeof payload.exp !== "number" || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());

  const login = (jwtToken, userData) => {
    const fullUser = { ...userData, token: jwtToken };

    sessionStorage.setItem(SESSION_STORAGE_KEYS.user, JSON.stringify(fullUser));

    setUser(fullUser);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.user);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || readStoredToken(),
        login,
        logout,
        isAuthenticated: isTokenUsable(user?.token || readStoredToken()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
