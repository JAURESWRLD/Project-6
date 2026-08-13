// src/utils/api.js

const API_BASE_URL = "http://localhost:8000/api";

export const apiRequest = async (endpoint, options = {}) => {
  let token = "";

  try {
    // Récupération de l'objet utilisateur complet sauvegardé par ton AuthContext
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      token = parsedUser?.token || "";
    }
  } catch (error) {
    console.error("Erreur lors de la lecture du token dans le localStorage :", error);
  }

  // Configuration globale de la requête fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} sur l'endpoint ${endpoint}`);
  }

  return response.json();
};