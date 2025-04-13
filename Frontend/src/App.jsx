import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import ForgotPass from "./pages/ForgotPass.jsx";
import Footer from './components/Footer.jsx';

function App() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
      setShowFooter(atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/ForgotPass" element={<ForgotPass />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/Register" element={<RegistrationPage />} />
          </Routes>
        </main>

        {/* This block reserves space, and toggles visibility */}
        <div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
