import { customFetch } from "./apiClient";
import { mockUserActivity } from "../mocks/userMock";

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

  return customFetch(
    `/user-activity?startWeek=${safeRange.startDate}&endWeek=${safeRange.endDate}`
  );
};