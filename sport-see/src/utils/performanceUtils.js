import { getStartOfWeek } from "./dateUtils";

export const filterSessionsByRange = (sessions, start, end) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  return sessions.filter((session) => {
    const sessionTime = session.parsedDate?.getTime() ?? new Date(session.date).getTime();
    return !Number.isNaN(sessionTime) && sessionTime >= startTime && sessionTime <= endTime;
  });
};

export const buildDistanceData = (sessions, startDate) =>
  [0, 1, 2, 3].map((weekIndex) => {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + weekIndex * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const totalKm = sessions.reduce((sum, session) => {
      const sessionDate = session.parsedDate ?? new Date(session.date);
      return sessionDate >= weekStart && sessionDate < weekEnd
        ? sum + Number(session.distance ?? session.distanceKm ?? 0)
        : sum;
    }, 0);

    return {
      dateLabel: `S${weekIndex + 1}`,
      km: Number(totalKm.toFixed(1)),
    };
  });

export const getAverageDistance = (distanceData) =>
  Math.round(
    distanceData.reduce((sum, entry) => sum + entry.km, 0) / (distanceData.length || 1)
  );

export const buildHeartRateData = (sessions, startDate) => {
  const weekStart = getStartOfWeek(startDate);
  const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return weekdayLabels.map((label, index) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(dayStart.getDate() + index);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const daySessions = sessions.filter((session) => {
      const sessionDate = session.parsedDate ?? new Date(session.date);
      return sessionDate >= dayStart && sessionDate < dayEnd;
    });

    if (daySessions.length === 0) {
      return { day: label, min: null, max: null, avg: null };
    }

    const min = Math.min(...daySessions.map((session) => session.heartRate?.min ?? 0));
    const max = Math.max(...daySessions.map((session) => session.heartRate?.max ?? 0));
    const avg = Math.round(
      daySessions.reduce((sum, session) => sum + (session.heartRate?.average ?? 0), 0) /
        daySessions.length
    );

    return { day: label, min, max, avg };
  });
};

export const getAverageHeartRate = (heartRateData) => {
  const activeEntries = heartRateData.filter((entry) => entry.avg !== null && entry.avg > 0);
  return activeEntries.length > 0
    ? Math.round(activeEntries.reduce((sum, entry) => sum + entry.avg, 0) / activeEntries.length)
    : null;
};

export const buildWeeklyStats = (sessions, weeklyGoalTarget = 6) => {
  const completedSessions = sessions.length;
  const remainingSessions = Math.max(weeklyGoalTarget - completedSessions, 0);

  return {
    weeklyGoalTarget,
    completedSessions,
    remainingSessions,
    weeklyGoalData: [
      { name: "Réalisées", value: completedSessions, fill: "#b3d1ff" },
      { name: "Restants", value: remainingSessions, fill: "#0B23F4" },
    ],
    totalWeeklyDistance: sessions.reduce(
      (sum, session) => sum + Number(session.distance ?? session.distanceKm ?? 0),
      0
    ),
    totalWeeklyDuration: sessions.reduce(
      (sum, session) => sum + Number(session.duration ?? session.durationMin ?? 0),
      0
    ),
  };
};
