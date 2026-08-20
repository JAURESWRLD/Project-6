import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { formatDisplayDate } from "../../../utils/dateUtils";

export const DistanceChart = ({
  styles,
  averageDistance,
  distanceDateRange,
  handleDistancePrev,
  handleDistanceNext,
  distanceData,
  hoveredIndex,
  setHoveredIndex,
}) => {
  return (
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

          <Bar dataKey="km" radius={[10, 10, 10, 10]} activeBar={false}>
            {distanceData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoveredIndex !== null ? "#0B23F4" : "#b6bdfc"}
                style={{ transition: 'fill 0.2s ease' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
};