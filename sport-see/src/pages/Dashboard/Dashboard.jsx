import styles from "./Dashboard.module.scss";
import MembreHeader from "../../components/MembreHeader/MembreHeader"; 
import Performance from "../../components/Performance/Performance"; 
import PageTransition from "../../components/PageTransition";

const Dashboard = () => {
  return (
    <>
    <PageTransition>
      <div className={styles.dashboardContent}>
        <MembreHeader />
        <Performance />
      </div>
    </PageTransition>
    </>
  );
};

export default Dashboard;