import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound = () => (
  <main className={styles.page}>
    <section className={styles.content}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page introuvable</h1>
      <p className={styles.message}>La page demandée n'existe pas.</p>
      <Link className={styles.link} to="/">
        Retour au tableau de bord
      </Link>
    </section>
  </main>
);

export default NotFound;
