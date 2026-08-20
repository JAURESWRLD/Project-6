import styles from "./Profil.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { useUserInfo } from "../../hooks/useUserInfo";
import IconLogo from "../../components/Logo/Logo";
import PageTransition from "../../components/PageTransition";

const Profil = () => {
  const { user } = useAuth();
  const { data, loading, error } = useUserInfo(Boolean(user));

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh', 
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <IconLogo /> 
          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>
            Chargement du profil...
          </p>
        </div>
      </div>
    );
  }
  if (error) return <p>Erreur : {error.message}</p>;
  if (!data) return null;

  const { profile, statistics } = data;
  const { firstName, lastName, age, weight, height, createdAt, profilePicture, gender } = profile;
  const {
    totalDistance = 0,
    totalSessions = 0,
    totalDuration = 0,
    totalCalories = null,
    totalRestDays = null,
  } = statistics || {};

  const joinDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const parsedDuration = Number(totalDuration) || 0;
  const totalDurationHours = Math.floor(parsedDuration / 60);
  const totalDurationMinutes = parsedDuration % 60;
  return (
    <>
    <PageTransition>
      <div className={styles.container}>
      
      {/* --- COLONNE PROFIL --- */}
      <div className={styles.profileColumn}>
        <div className={styles.profileWrapper}>
          
          {/* Carte En-tête Utilisateur */}
          <div className={styles.userCard}>
            <div className={styles.photoProfilCadre}>
              <img 
                className={styles.avatar} 
                src={profilePicture} 
                alt={`${firstName} ${lastName}`} 
              />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{firstName} {lastName}</div>
              <div className={styles.userMeta}> Membre depuis le {joinDate}</div>
            </div>
          </div>
          
          {/* Carte Détails du Profil */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>Votre profil</div>
              <div className={styles.separator}></div>
            </div>
            
            <div className={styles.infoList}>
              <div className={styles.infoItem}>Âge : {age}</div>
              <div className={styles.infoItem}>Genre : {gender ?? "N/A"}</div>
              <div className={styles.infoItem}>Taille : {height}m</div>
              <div className={styles.infoItem}>Poids : {weight}kg</div>
            </div>
          </div>

        </div>
      </div>

      {/* --- COLONNE STATISTIQUES --- */}
      <div className={styles.statsColumn}>
        <div className={styles.statsHeader}>
          <div className={styles.statsTitle}>Vos statistiques</div>
          <div className={styles.statsSubtitle}> Depuis le {joinDate}</div>
        </div>
        
        <div className={styles.statsGrid}>
          {/* Rangée gauche */}
          <div className={styles.gridColumn}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Temps total couru</div>
              <div className={styles.statValueWrapper}>
                <span className={styles.mainValue}>{totalDurationHours}h</span>
                <span className={styles.subValue}>{totalDurationMinutes}min</span>
              </div>
            </div>
            
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Distance totale parcourue</div>
              <div className={styles.statValueWrapper}>
                <span className={styles.mainValue}>{totalDistance}</span>
                <span className={styles.subValue}>km</span>
              </div>
            </div>
            
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Nombre de sessions</div>
              <div className={styles.statValueWrapper}>
                <span className={styles.mainValue}>{totalSessions}</span>
                <span className={styles.subValue}>sessions</span>
              </div>
            </div>
          </div>
          
          {/* Rangée droite */}
          <div className={styles.gridColumn}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Calories brûlées</div>
              <div className={styles.statValueWrapper}>
                <span className={styles.mainValue}>{totalCalories ?? "N/A"}</span>
                <span className={styles.subValue}>cal</span>
              </div>
            </div>

            <div className={styles.statBox}>
              <div className={styles.statLabel}>Nombre de jours de repos</div>
              <div className={styles.statValueWrapper}>
                <span className={styles.mainValue}>{totalRestDays ?? "N/A"}</span>
                <span className={styles.subValue}>jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    </PageTransition>
    </>
  );
};

export default Profil;
