import { customFetch } from "./apiClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const createMockToken = () => {
  const payload = btoa(
    JSON.stringify({ userId: 1, exp: Math.floor(Date.now() / 1000) + 3600 })
  );
  return `mock.${payload}.token`;
};

export const loginUser = async (credentials) => {
  if (USE_MOCK) {
    if (!credentials.username || !credentials.password) {
      throw new Error("Identifiant et mot de passe requis");
    }

    return { token: createMockToken(), userId: 1 };
  }

  return customFetch("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};