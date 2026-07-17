import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import AuthRoutes from "./features/auth/routes/AuthRoutes";
import Dashboard from "./features/dashboard/pages/Dashboard";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<AuthRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
