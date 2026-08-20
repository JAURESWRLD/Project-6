import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { formatShortDate } from "../../../utils/dateUtils";

export const WeeklyStats = ({ styles, heartDateRange, weeklyStats }) => {
  return (
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
  );
};