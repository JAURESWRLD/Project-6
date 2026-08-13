import { Link } from "react-router-dom";
import Login from "../../components/Login/Login";
import styles from "./Login.module.scss"; 
import IconLogo from "../../components/Logo/Logo";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeLeft}>
        <div className={styles.loginWrapper}>
          <div className={styles.logoWrapper}>
            <IconLogo />
            <h1 className={styles.logoText}>SPORTSEE</h1>
          </div>
          <Login />
        </div>
      </div>

      <div className={styles.homeRight}>
        <img
          src="/images/image1.jpg"
          alt="Course sportive"
          style={{
            width: '100%', 
            height: '1024px',
            objectFit: 'cover',       
            objectPosition: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default Home;
