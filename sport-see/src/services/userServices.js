import { mockUserInfo } from "../mocks/userMock";

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const getStoredToken = () => {
  try {
    return JSON.parse(sessionStorage.getItem("sportsee_user") || "null")?.token || "";
  } catch {
    return "";
  }
};

export const fetchUserInfo = async () => {
  if (USE_MOCK) {
    return mockUserInfo;
  }

  const token = getStoredToken();
  if (!token) {
    throw new Error("Vous devez être connecté pour récupérer le profil.");
  }

  const response = await fetch(`${API_URL}/user-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status} lors de la récupération du profil`);
  }

  return response.json();
};
