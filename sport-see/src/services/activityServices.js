import { mockUserActivity } from "../mocks/userMock";

const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const getDefaultDateRange = () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 6);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: today.toISOString().slice(0, 10),
  };
};

export const fetchUserActivities = async (startDate, endDate) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockUserActivity;
  }

  const safeRange = {
    startDate: startDate || getDefaultDateRange().startDate,
    endDate: endDate || getDefaultDateRange().endDate,
  };

  let token = null;
  try {
    token = JSON.parse(sessionStorage.getItem("sportsee_user") || "null")?.token;
  } catch {
    token = null;
  }

  if (!token) {
    throw new Error("Vous devez être connecté pour récupérer les activités.");
  }

  const response = await fetch(
    `${API_URL}/user-activity?startWeek=${safeRange.startDate}&endWeek=${safeRange.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des données réelles");
  }

  return await response.json();
};