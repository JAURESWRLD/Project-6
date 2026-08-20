import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useAuth } from "../../hooks/useAuth";
import IconLogo from "../Logo/Logo";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <IconLogo />
        <h1 className={styles.logoText}>SPORTSEE</h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? styles.active : ""}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profil" 
              className={({ isActive }) => isActive ? styles.active : ""}
            >
              Mon profil
            </NavLink>
          </li>
          
          {/* La fameuse ligne verticale de séparation de ta capture d'écran */}
          <li className={styles.divider} aria-hidden="true"></li>

          <li>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Se déconnecter
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;