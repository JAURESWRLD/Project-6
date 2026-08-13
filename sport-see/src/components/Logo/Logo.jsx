import styles from "./Logo.module.scss";

const ActivityIcon = () => {
  return (
    <div className={styles.iconContainer}>
      {/* Barre 1 (Tout à gauche) */}
      <div className={styles.barColumn}>
        <div className={styles.barGradient2} style={{ height: '11px', marginTop: '3px' }} />
        <div className={styles.barGradient1} style={{ height: '8px', marginTop: '-4px' }} />
      </div>

      {/* Barre 2 */}
      <div className={styles.barColumn}>
        <div className={styles.barGradient2} style={{ height: '14px' }} />
        <div className={styles.barGradient1} style={{ height: '10px', marginTop: '-4px' }} />
      </div>

      {/* Barre 3 (Milieu) */}
      <div className={styles.barColumn} style={{ paddingTop: '2px' }}>
        <div className={styles.barGradient2} style={{ height: '12px' }} />
        <div className={styles.barGradient1} style={{ height: '6px', marginTop: '-4px' }} />
      </div>

      {/* Barre 4 */}
      <div className={styles.barColumn} style={{ paddingTop: '2px' }}>
        <div className={styles.barGradient2} style={{ height: '9px' }} />
        <div className={styles.barGradient1} style={{ height: '9px', marginTop: '-4px' }} />
      </div>

      {/* Barre 5 (Tout à droite) */}
      <div className={styles.barColumn}>
        <div className={styles.barGradient2} style={{ height: '14px' }} />
        <div className={styles.barGradient1} style={{ height: '7px', marginTop: '-4px' }} />
      </div>
    </div>
  );
};

export default ActivityIcon;