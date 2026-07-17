import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import AuthRoutes from "./features/auth/routes/AuthRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<AuthRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
