import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../utils/hooks/useAuth";
import Header from "./Header/Header"; 
import Footer from "./Footer/Footer";

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  return (
    <div className="app-layout">
      <Header />
      
      {/* Gère la sortie de l'ancienne page avant l'entrée de la nouvelle */}
      <AnimatePresence mode="wait"> 
        <main className="content-container" key={location.pathname}>
          <Outlet /> 
        </main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;