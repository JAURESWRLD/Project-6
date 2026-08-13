import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Cell, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Legend, PieChart, Pie, ReferenceLine, CartesianGrid
} from "recharts";
import styles from "./Perfomance.module.scss";
import { useFetch } from "../../utils/hooks";
import { useAuth } from "../../utils/hooks/useAuth";
import IconLogo from "../Logo/Logo";

// --- FONCTIONS UTILITAIRES ---
const formatDateToAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateString) => {
  const options = { day: 'numeric', month: 'long' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStartOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - (day === 0 ? 6 : day - 1);
  const startDate = new Date(date.setDate(diff));
  startDate.setHours(0, 0, 0, 0);
  return startDate;
};

const getEndOfWeek = (d) => {
  const start = getStartOfWeek(d);
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return endDate;
};

const getEndOf4Weeks = (startOfWeek) => {
  const d = new Date(startOfWeek);
  d.setDate(d.getDate() + 21);
  return getEndOfWeek(d);
};

const extractSessions = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  return [];
};

const getValidSessions = (sessions = []) =>
  sessions.filter((session) => session && session.date && !Number.isNaN(new Date(session.date).getTime()));

const getEarliestWeekRange = (sessions) => {
  const validSessions = getValidSessions(sessions);
  if (validSessions.length === 0) return null;

  const minTimestamp = Math.min(...validSessions.map((s) => new Date(s.date).getTime()));
  const earliestDate = new Date(minTimestamp);

  return {
    start: getStartOfWeek(earliestDate),
    end: getEndOfWeek(earliestDate),
  };
};

// --- COMPOSANT PRINCIPAL ---
const Performance = () => {
  const { user } = useAuth();
  const today = new Date();

  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Plages de dates
  const [distanceDateRange, setDistanceDateRange] = useState(() => ({
    start: getStartOfWeek(today),
    end: getEndOf4Weeks(getStartOfWeek(today))
  }));

  const [heartDateRange, setHeartDateRange] = useState(() => ({
    start: getStartOfWeek(today),
    end: getEndOfWeek(today)
  }));

  const [initialRangeSet, setInitialRangeSet] = useState(false);

  // Requête API
  const allActivitiesEndpoint = user
    ? `http://localhost:8000/api/user-activity?startWeek=2025-01-01&endWeek=${formatDateToAPI(today)}`
    : null;

  const allActivitiesQuery = useFetch(allActivitiesEndpoint);
  const allActivities = extractSessions(allActivitiesQuery.data);

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
    if (!user || initialRangeSet || allActivitiesQuery.loading || allActivitiesQuery.error) return;

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
  }, [user, allActivities, allActivitiesQuery.loading, allActivitiesQuery.error, initialRangeSet]);

  // 1. MÉMORISATION - DONNÉES DISTANCE
  const distanceSessions = useMemo(() => {
    return allActivities.filter((session) => {
      const sessionDate = new Date(session.date);
      if (Number.isNaN(sessionDate.getTime())) return false;
      return sessionDate >= new Date(distanceDateRange.start) && sessionDate <= new Date(distanceDateRange.end);
    });
  }, [allActivities, distanceDateRange]);

  const distanceData = useMemo(() => {
    return [0, 1, 2, 3].map((weekIndex) => {
      const wStart = new Date(distanceDateRange.start);
      wStart.setDate(wStart.getDate() + weekIndex * 7);
      wStart.setHours(0, 0, 0, 0);

      const wEnd = new Date(wStart);
      wEnd.setDate(wEnd.getDate() + 7);
      wEnd.setHours(0, 0, 0, 0);

      const totalKmForWeek = distanceSessions.reduce((sum, session) => {
        const sDate = new Date(session.date);
        if (sDate >= wStart && sDate < wEnd) {
          return sum + (session.distance ?? 0);
        }
        return sum;
      }, 0);

      return {
        dateLabel: `S${weekIndex + 1}`,
        km: Number(totalKmForWeek.toFixed(1)),
      };
    });
  }, [distanceSessions, distanceDateRange.start]);

  const averageDistance = useMemo(() => {
    return Math.round(
      distanceData.reduce((sum, entry) => sum + entry.km, 0) / (distanceData.length || 1)
    );
  }, [distanceData]);

  // 2. MÉMORISATION - DONNÉES CARDIO
  const heartSessions = useMemo(() => {
    return allActivities.filter((session) => {
      const sessionDate = new Date(session.date);
      if (Number.isNaN(sessionDate.getTime())) return false;
      return sessionDate >= new Date(heartDateRange.start) && sessionDate <= new Date(heartDateRange.end);
    });
  }, [allActivities, heartDateRange]);

  const heartRateData = useMemo(() => {
    const weekStart = getStartOfWeek(heartDateRange.start);
    const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    return weekdayLabels.map((label, index) => {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + index);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const daySessions = heartSessions.filter((s) => {
        const sDate = new Date(s.date);
        return sDate >= dayStart && sDate < dayEnd;
      });

      if (daySessions.length === 0) {
        return { day: label, min: null, max: null, avg: null };
      }

      const minBpm = Math.min(...daySessions.map((s) => s.heartRate?.min ?? 0));
      const maxBpm = Math.max(...daySessions.map((s) => s.heartRate?.max ?? 0));
      const avgBpm = Math.round(
        daySessions.reduce((sum, s) => sum + (s.heartRate?.average ?? 0), 0) / daySessions.length
      );

      return {
        day: label,
        min: minBpm,
        max: maxBpm,
        avg: avgBpm,
      };
    });
  }, [heartSessions, heartDateRange.start]);

  const heartAverageBpm = useMemo(() => {
    const activeEntries = heartRateData.filter((entry) => entry.avg !== null && entry.avg > 0);
    return activeEntries.length > 0
      ? Math.round(activeEntries.reduce((sum, entry) => sum + entry.avg, 0) / activeEntries.length)
      : null;
  }, [heartRateData]);

  // 3. MÉMORISATION - STATISTIQUES "CETTE SEMAINE"
  const weeklyStats = useMemo(() => {
    const weeklyGoalTarget = 6;
    const completedSessions = heartSessions.length;
    const remainingSessions = Math.max(weeklyGoalTarget - completedSessions, 0);

    const weeklyGoalData = [
      { name: "Réalisées", value: completedSessions, fill: "#b3d1ff" },
      { name: "Restants", value: remainingSessions, fill: "#0B23F4" },
    ];

    const totalWeeklyDistance = heartSessions.reduce((sum, session) => sum + (session.distance ?? 0), 0);
    const totalWeeklyDuration = heartSessions.reduce((sum, session) => sum + (session.duration ?? 0), 0);

    return {
      weeklyGoalTarget,
      completedSessions,
      remainingSessions,
      weeklyGoalData,
      totalWeeklyDistance,
      totalWeeklyDuration,
    };
  }, [heartSessions]);

  // ÉCRANS DE CHARGEMENT ET ERREURS
  if (allActivitiesQuery.loading || (allActivities.length === 0 && !allActivitiesQuery.error && !initialRangeSet)) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <IconLogo />
          <p>Chargement des performances...</p>
        </div>
      </div>
    );
  }

  if (allActivitiesQuery.error) return <p>Erreur : {allActivitiesQuery.error.message}</p>;

  return (
    <section className={styles.performance}>
      <h2>Vos dernières performances</h2>

      <div className={styles.charts}>
        {/* --- BLOC DISTANCE --- */}
        <article className={styles.chartBox}>
          <div className={styles.chartHeader}>
            <div className={styles.titleArea}>
              <h3 className={styles.kmEnMoyenne}>{averageDistance} km en moyenne</h3>
              <p>Total des kilomètres sur 4 semaines</p>
            </div>

            <div className={styles.datePagination}>
              <button onClick={handleDistancePrev} aria-label="Semaine précédente">‹</button>
              <span className={styles.dateLabel}>
                {formatDisplayDate(distanceDateRange.start)} - {formatDisplayDate(distanceDateRange.end)}
              </span>
              <button onClick={handleDistanceNext} aria-label="Semaine suivante">›</button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={distanceData} barSize={18} margin={{ left: -20, bottom: 20 }}>
              <XAxis dataKey="dateLabel" tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis domain={[0, 30]} ticks={[0, 10, 20, 30]} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <ReferenceLine y={7} stroke="#e0e0e0" strokeDasharray="3 3" />
              <ReferenceLine y={17} stroke="#e0e0e0" strokeDasharray="3 3" />
              <ReferenceLine y={27} stroke="#e0e0e0" strokeDasharray="3 3" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />

              <Legend
                align="left"
                content={() => (
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', marginLeft: '20px', fontSize: '12px', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: "#0B23F4", display: 'inline-block' }}></span>
                      <span style={{ color: '#4b5563' }}>km</span>
                    </div>
                  </div>
                )}
              />

              <Bar dataKey="km" radius={[10, 10, 10, 10]}>
                {distanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hoveredIndex === null || hoveredIndex === index ? "#0B23F4" : "#B6BDFC"}
                    style={{ transition: 'fill 0.2s ease' }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </article>

        {/* --- BLOC FRÉQUENCE CARDIAQUE --- */}
        <article className={styles.chartBox}>
          <div className={styles.chartHeader}>
            <div className={styles.titleArea}>
              <h3>{heartAverageBpm !== null ? `${heartAverageBpm} BPM` : "— BPM"}</h3>
              <p>Fréquence cardiaque moyenne</p>
            </div>

            <div className={styles.datePagination}>
              <button onClick={handleHeartPrev} aria-label="Semaine précédente">‹</button>
              <span className={styles.dateLabel}>
                {formatDisplayDate(heartDateRange.start)} - {formatDisplayDate(heartDateRange.end)}
              </span>
              <button onClick={handleHeartNext} aria-label="Semaine suivante">›</button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={heartRateData} barSize={18} margin={{ left: -35, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis domain={[130, 187]} ticks={[130, 145, 160, 187]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
              <Tooltip />
              <Legend
                align="left"
                content={() => (
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', marginLeft: '2.3rem', fontSize: '12px', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffb3b3', display: 'inline-block' }}></span>
                      <span style={{ color: '#4b5563' }}>Min</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F4320B', display: 'inline-block' }}></span>
                      <span style={{ color: '#4b5563' }}>Max</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0A24FA', display: 'inline-block' }}></span>
                      <span style={{ color: '#4b5563' }}>BPM Moyen</span>
                    </div>
                  </div>
                )}
              />
              <Bar dataKey="min" fill="#ffb3b3" radius={[10, 10, 10, 10]} />
              <Bar dataKey="max" fill="#F4320B" radius={[10, 10, 10, 10]} />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#0A24FA"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: "#0A24FA" }}
                activeDot={{ strokeWidth: 2, fill: "#0A24FA" }}
                connectNulls={true}  
              />
            </ComposedChart>
          </ResponsiveContainer>
        </article>
      </div>

      {/* --- SECTION CETTE SEMAINE --- */}
      <section className={styles.weekly}>
        <h2 className={styles.cetteSemaine}>Cette semaine</h2>
        <p className={styles.periode}>
          Du {formatShortDate(heartDateRange.start)} au {formatShortDate(heartDateRange.end)}
        </p>
        <div className={styles.weeklyContent}>
          <div className={styles.weeklyChart}>
            <div className={styles.pieChart}>
              <div className={styles.pieChartInner}>
                <div className={styles.mainValueParent}>
                  <div className={styles.mainValue}>
                    <div className={styles.x4}>x{weeklyStats.completedSessions}</div>
                    <div className={styles.surObjectifDe}>sur objectif de {weeklyStats.weeklyGoalTarget}</div>
                  </div>
                  <div className={styles.coursesHebdomadaireRalises}>Courses hebdomadaires réalisées</div>
                </div>
              </div>
              <div className={styles.data}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={weeklyStats.weeklyGoalData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius="50%"
                      outerRadius="100%"
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={3}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className={styles.dataContent}>
                  <span className={styles.intetityColorCircle} style={{ backgroundColor: weeklyStats.weeklyGoalData[0].fill }}></span>
                  <div className={styles.div}>
                    <div className={styles.restants}>{weeklyStats.completedSessions} réalisées</div>
                  </div>
                </div>
                <div className={styles.dataContent2}>
                  <span className={styles.intetityColorCircle} style={{ backgroundColor: weeklyStats.weeklyGoalData[1].fill }}></span>
                  <div className={styles.div}>
                    <div className={styles.restants}>{weeklyStats.remainingSessions} restants</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.weeklyStats}>
            <div className={styles.statBox}>
              <div className={styles.dureDactivit}>Durée d’activité</div>
              <div className={styles.parent}>
                <div className={styles.div}>{weeklyStats.totalWeeklyDuration}</div>
                <div className={styles.minutes}>minutes</div>
              </div>
            </div>
            <div className={styles.statBox}>
              <h3 className={styles.dureDactivit}>Distance</h3>
              <div className={styles.group}>
                <div className={styles.div}>{weeklyStats.totalWeeklyDistance.toFixed(1)}</div>
                <div className={styles.kilomtres}>kilomètres</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Performance;