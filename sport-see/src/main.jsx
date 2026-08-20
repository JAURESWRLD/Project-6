import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ProtectedLayout from "./components/protectedLayout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PlanGenerator from "./pages/PlanGenerator/PlanGenerator";
import Profil from "./pages/Profil/Profil";
import Logout from "./pages/Logout/Logout";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  // --- ROUTE PUBLIQUE : Login (Pas de Header, pas d'authentification requise) ---
  { 
    path: "/login", 
    element: <Login /> 
  },

  // --- ROUTES PROTÉGÉES (Partagent le Header et la barrière de connexion) ---
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/planGenerator",
        element: <PlanGenerator />,
      },
      {
        path: "/profil",
        element: <Profil />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);