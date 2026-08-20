import styles from "./Login.module.css";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ username, password });
      login(data.token, { id: data.userId, username }); // stocke token + userId
      navigate("/dashboard");
    } catch (error) {
      alert(error.message || "Identifiants incorrects");
    }
  };

  return (
    <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            Transformez <br /> vos stats en résultats
          </div>

          <div className={styles.loginFormWrapper}>
            <div className={styles.loginTitle}>Se connecter</div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Adresse email</label>
              <input 
                type="email" 
                className={styles.inputField} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Mot de passe</label>
              <input 
                type="password" 
                className={styles.inputField} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className={styles.loginButton} onClick={handleSubmit}>
            Se connecter
          </button>

          <div className={styles.forgotPassword}>Mot de passe oublié ?</div>
        </div>
  );
};

export default Login;
