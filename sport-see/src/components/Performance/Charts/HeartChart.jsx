import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { formatDisplayDate } from "../../../utils/dateUtils";

export const HeartRateChart = ({
  styles,
  heartAverageBpm,
  heartDateRange,
  handleHeartPrev,
  handleHeartNext,
  heartRateData,
}) => {
  const [isLineHovered, setIsLineHovered] = useState(false);

  const renderPoint = (pointProps) => {
    const { cx, cy } = pointProps;
    if (cx === undefined || cy === undefined) return null;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#0A24FA"
        stroke="none"
        onMouseEnter={() => setIsLineHovered(true)}
        onMouseLeave={() => setIsLineHovered(false)}
      />
    );
  };

  return (
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
          <Bar
            dataKey="min"
            fill="#ffb3b3"
            radius={[10, 10, 10, 10]}
            onMouseEnter={() => setIsLineHovered(true)}
            onMouseLeave={() => setIsLineHovered(false)}
          />
          <Bar
            dataKey="max"
            fill="#F4320B"
            radius={[10, 10, 10, 10]}
            onMouseEnter={() => setIsLineHovered(true)}
            onMouseLeave={() => setIsLineHovered(false)}
          />
          <Line
            type="natural"
            dataKey="avg"
            stroke={isLineHovered ? "#0B23F4" : "#D1D5DB"}
            strokeWidth={3}
            dot={renderPoint}
            activeDot={false}
            connectNulls={true}
            onMouseEnter={() => setIsLineHovered(true)}
            onMouseLeave={() => setIsLineHovered(false)}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </article>
  );
};