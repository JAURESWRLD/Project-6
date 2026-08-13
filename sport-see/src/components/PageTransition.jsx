import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      // L'ancienne page s'efface doucement en descendant légèrement et en devenant transparente
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      
      // La nouvelle page arrive avec une courbe cinématique ultra-fluide
      animate={{ opacity: 1, y: 0, scale: 1 }}
      
      // La page sortante s'efface complètement à 0 (au lieu de 0.5 qui créait une coupure visuelle)
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      
      transition={{ 
        duration: 0.9,
        delay: 0.05,   
        ease: [0.215, 0.610, 0.355, 1] 
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;