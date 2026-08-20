import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextValue";

const SESSION_STORAGE_KEY = "sportsee_user";

const isTokenUsable = (token) => {
  if (!token) return false;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return false;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    return typeof payload.exp !== "number" || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const readStoredUser = () => {
  try {
    const savedUser = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!savedUser) return null;

    const parsedUser = JSON.parse(savedUser);
    
    // Purge automatique au démarrage si le token est expiré
    if (!isTokenUsable(parsedUser?.token)) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsedUser;
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());

  const logout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
  };

  const login = (jwtToken, userData) => {
    const fullUser = { ...userData, token: jwtToken };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fullUser));
    setUser(fullUser);
  };

  // Synchro de l'état React avec les rejets 401/403 émises par l'API
  useEffect(() => {
    const handleAuthLogout = () => logout();
    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  const token = user?.token || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: isTokenUsable(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};