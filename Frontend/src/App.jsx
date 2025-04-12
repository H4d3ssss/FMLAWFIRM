<<<<<<< HEAD
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import ForgotPass from "./pages/ForgotPass.jsx";
import Footer from './components/Footer.jsx';
import Sidebar from "./components/Sidebar.jsx";

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
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Navbar,
  Calendar,
  Sidebar,
  Footer,
  LoginForm,
  RegisterForm,
} from "./components";
>>>>>>> 68271b81ed458b5044393788eac4f7d8b8f7c096

  return (
<<<<<<< HEAD
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
=======
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Calendar />} />
        </Routes>
      </Router>
    </>
  );
};
>>>>>>> 68271b81ed458b5044393788eac4f7d8b8f7c096

export default App;
