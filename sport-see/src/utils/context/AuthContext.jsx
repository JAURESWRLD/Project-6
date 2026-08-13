import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (jwtToken, userData) => {
    const fullUser = { ...userData, token: jwtToken };
    
    // ✅ 1. On sauvegarde l'objet utilisateur
    localStorage.setItem("user", JSON.stringify(fullUser));
    
    // ✅ 2. On sauvegarde la clé 'token' en direct pour generateTrainingPlan() et les autres requêtes fetch !
    localStorage.setItem("token", jwtToken); 
    
    setUser(fullUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // 🧹 Nettoyage du token
    setUser(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || localStorage.getItem("token"),
        login,
        logout,
        isAuthenticated: !!user?.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);