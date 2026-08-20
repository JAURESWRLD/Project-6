const API_URL = import.meta.env.VITE_API_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const createMockToken = () => {
  const payload = btoa(JSON.stringify({ userId: 1, exp: Math.floor(Date.now() / 1000) + 3600 }));
  return `mock.${payload}.token`;
};

export const loginUser = async (credentials) => {
  if (USE_MOCK) {
    if (!credentials.username || !credentials.password) {
      throw new Error("Identifiant et mot de passe requis");
    }

    return { token: createMockToken(), userId: 1 };
  }

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Identifiants incorrects");
  }

  return data;
};
