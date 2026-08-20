export const formatDateToAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateString) => {
  const options = { day: "numeric", month: "long" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getStartOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - (day === 0 ? 6 : day - 1);
  const startDate = new Date(date.setDate(diff));
  startDate.setHours(0, 0, 0, 0);
  return startDate;
};

export const getEndOfWeek = (d) => {
  const start = getStartOfWeek(d);
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
};

export const getEndOf4Weeks = (startOfWeek) => {
  const d = new Date(startOfWeek);
  d.setDate(d.getDate() + 21);
  return getEndOfWeek(d);
};

export const extractSessions = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  return [];
};

export const getValidSessions = (sessions = []) =>
  sessions.filter(
    (session) => session && session.date && !Number.isNaN(new Date(session.date).getTime())
  );

export const getEarliestWeekRange = (sessions) => {
  const validSessions = getValidSessions(sessions);
  if (validSessions.length === 0) return null;

  const minTimestamp = Math.min(...validSessions.map((s) => new Date(s.date).getTime()));
  const earliestDate = new Date(minTimestamp);

  return {
    start: getStartOfWeek(earliestDate),
    end: getEndOfWeek(earliestDate),
  };
};