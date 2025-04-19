import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import ForgotPass from "./pages/ForgotPass.jsx";
import Footer from "./components/Footer.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import CasesPage from "./pages/CasesPage.jsx";


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
        {/* Conditionally render Sidebar for specific routes */}
        {location.pathname.startsWith("/AdminDashboard") && <Sidebar />}

        <main className="flex-grow">
          <Routes>
            {/* Default route (LoginPage) */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />

            {/* Other pages */}
            <Route path="/ForgotPass" element={<ForgotPass />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/Register" element={<RegistrationPage />} />
          </Routes>

        </main>

        {/* Footer visibility logic */}
        {showFooter && (
          <div>
            <Footer />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
