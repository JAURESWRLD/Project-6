import React from "react";
import styles from "./Dashboard.module.scss";
import Header from "../../components/Header/Header"; 
import MembreHeader from "../../components/MembreHeader/MembreHeader"; 
import Performance from "../../components/Perfomance/Perfomance"; 
import Footer from "../../components/Footer/Footer";
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