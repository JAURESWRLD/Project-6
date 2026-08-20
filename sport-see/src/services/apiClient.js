const API_URL = import.meta.env.VITE_API_URL;

const getStoredToken = () => {
  try {
    return JSON.parse(sessionStorage.getItem("sportsee_user") || "null")?.token || "";
  } catch {
    return "";
  }
};

export const customFetch = async (endpoint, options = {}) => {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Nettoyage de la session et notification globale au Context React
      sessionStorage.removeItem("sportsee_user");
      window.dispatchEvent(new Event("auth:logout"));
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    throw new Error(`Erreur ${response.status} lors de l'accès à ${endpoint}`);
  }

  return response.json();
};