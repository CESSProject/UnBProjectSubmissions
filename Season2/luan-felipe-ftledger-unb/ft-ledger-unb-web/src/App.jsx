// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import PortalPage from "./pages/PortalPage.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Login / Cadastro */}
      <Route path="/login" element={<LoginPage />} />

      {/* Portal protegido por login */}
      <Route
        path="/portal"
        element={
          <RequireAuth>
            <PortalPage />
          </RequireAuth>
        }
      />

      {/* Qualquer rota cai no portal (e se não tiver token, o RequireAuth joga pro login) */}
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
}

