import { customFetch } from "./apiClient";
import { mockUserInfo } from "../mocks/userMock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const fetchUserInfo = async () => {
  if (USE_MOCK) {
    return mockUserInfo;
  }

  return customFetch("/user-info");
};