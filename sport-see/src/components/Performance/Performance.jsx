import { useState, useEffect, useMemo } from "react";
import styles from "./Performance.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { useUserActivities } from "../../hooks/useUserActivity";
import IconLogo from "../Logo/Logo";
import { DistanceChart } from "./Charts/DistanceChart";
import { HeartRateChart } from "./Charts/HeartChart";
import { WeeklyStats } from "./Charts/WeeklyStats";
import {
  formatDateToAPI,
  getStartOfWeek,
  getEndOfWeek,
  getEndOf4Weeks,
  extractSessions,
  getValidSessions,
  getEarliestWeekRange,
} from "../../utils/dateUtils";
import {
  filterSessionsByRange,
  buildDistanceData,
  getAverageDistance,
  buildHeartRateData,
  getAverageHeartRate,
  buildWeeklyStats,
} from "../../utils/performanceUtils";

const Performance = () => {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Plages de dates
  const [distanceDateRange, setDistanceDateRange] = useState(() => ({
    start: getStartOfWeek(today),
    end: getEndOf4Weeks(getStartOfWeek(today)),
  }));

  const [heartDateRange, setHeartDateRange] = useState(() => ({
    start: getStartOfWeek(today),
    end: getEndOfWeek(today),
  }));

  const [initialRangeSet, setInitialRangeSet] = useState(false);

  // Requête API
  const allActivitiesStartDate = user ? "2025-01-01" : undefined;
  const { data, loading, error } = useUserActivities(
    allActivitiesStartDate,
    user ? formatDateToAPI(today) : undefined
  );

  // ⚡ FIX 1: Mémoïsation et pré-parsing des dates pour éviter la saturation du CPU
  const allActivities = useMemo(() => {
    const rawSessions = extractSessions(data);
    return rawSessions.map((session) => ({
      ...session,
      parsedDate: new Date(session.date),
    }));
  }, [data]);

  // Pagination Distances
  const handleDistancePrev = () => {
    setDistanceDateRange((prev) => {
      const newStart = new Date(prev.start);
      const newEnd = new Date(prev.end);
      newStart.setDate(newStart.getDate() - 28);
      newEnd.setDate(newEnd.getDate() - 28);
      return { start: getStartOfWeek(newStart), end: getEndOfWeek(newEnd) };
    });
  };

  const handleDistanceNext = () => {
    setDistanceDateRange((prev) => {
      const newStart = new Date(prev.start);
      const newEnd = new Date(prev.end);
      newStart.setDate(newStart.getDate() + 28);
      newEnd.setDate(newEnd.getDate() + 28);
      return { start: getStartOfWeek(newStart), end: getEndOfWeek(newEnd) };
    });
  };

  // Pagination Cardio
  const handleHeartPrev = () => {
    setHeartDateRange((prev) => {
      const newStart = new Date(prev.start);
      newStart.setDate(newStart.getDate() - 7);
      return { start: getStartOfWeek(newStart), end: getEndOfWeek(newStart) };
    });
  };

  const handleHeartNext = () => {
    setHeartDateRange((prev) => {
      const newStart = new Date(prev.start);
      newStart.setDate(newStart.getDate() + 7);
      return { start: getStartOfWeek(newStart), end: getEndOfWeek(newStart) };
    });
  };

  // Synchronisation initiale
  useEffect(() => {
    if (!user || initialRangeSet || loading || error) return;

    const validSessions = getValidSessions(allActivities);
    if (validSessions.length === 0) {
      setInitialRangeSet(true);
      return;
    }

    const earliestWeek = getEarliestWeekRange(validSessions);

    if (earliestWeek) {
      setHeartDateRange(earliestWeek);
      setDistanceDateRange({
        start: earliestWeek.start,
        end: getEndOf4Weeks(earliestWeek.start),
      });
    }

    setInitialRangeSet(true);
  }, [user, allActivities, loading, error, initialRangeSet]);

  // DONNÉES DISTANCE
  const distanceSessions = useMemo(() => {
    return filterSessionsByRange(
      allActivities,
      distanceDateRange.start,
      distanceDateRange.end
    );
  }, [allActivities, distanceDateRange]);

  const distanceData = useMemo(
    () => buildDistanceData(distanceSessions, distanceDateRange.start),
    [distanceSessions, distanceDateRange.start]
  );

  const averageDistance = useMemo(() => getAverageDistance(distanceData), [distanceData]);

  // DONNÉES CARDIO
  const heartSessions = useMemo(() => {
    return filterSessionsByRange(allActivities, heartDateRange.start, heartDateRange.end);
  }, [allActivities, heartDateRange]);

  const heartRateData = useMemo(
    () => buildHeartRateData(heartSessions, heartDateRange.start),
    [heartSessions, heartDateRange.start]
  );

  const heartAverageBpm = useMemo(() => getAverageHeartRate(heartRateData), [heartRateData]);

  // STATISTIQUES "CETTE SEMAINE"
  const weeklyStats = useMemo(() => buildWeeklyStats(heartSessions), [heartSessions]);

  if (loading || (allActivities.length === 0 && !error && !initialRangeSet)) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <IconLogo />
          <p>Chargement des performances...</p>
        </div>
      </div>
    );
  }

  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <section className={styles.performance}>
      <h2>Vos dernières performances</h2>

      <div className={styles.charts}>
        <DistanceChart
          styles={styles}
          averageDistance={averageDistance}
          distanceDateRange={distanceDateRange}
          handleDistancePrev={handleDistancePrev}
          handleDistanceNext={handleDistanceNext}
          distanceData={distanceData}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />

        <HeartRateChart
          styles={styles}
          heartAverageBpm={heartAverageBpm}
          heartDateRange={heartDateRange}
          handleHeartPrev={handleHeartPrev}
          handleHeartNext={handleHeartNext}
          heartRateData={heartRateData}
        />
      </div>

      <WeeklyStats
        styles={styles}
        heartDateRange={heartDateRange}
        weeklyStats={weeklyStats}
      />
    </section>
  );
};

export default Performance;