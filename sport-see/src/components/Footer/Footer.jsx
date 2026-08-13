import ActivityIcon from '../Logo/Logo';
import styles from './Footer.module.css';


const Footer = () => {
  	return (
    		<div className={styles.footer}>
      			<div className={styles.sportseeParent}>
        				<div className={styles.sportsee}>©Sportsee</div>
        				<div className={styles.sportsee}>Tous droits réservés</div>
      			</div>
      			<div className={styles.conditionsGnralesParent}>
        				<div className={styles.sportsee}>Conditions générales</div>
        				<div className={styles.contact}>Contact</div>
        				<div className={styles.logo}>
                            <ActivityIcon />
        				</div>
      			</div>
    		</div>);
};

export default Footer ;
