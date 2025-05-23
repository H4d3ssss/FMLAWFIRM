import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import CalendarPage from "./pages/CalendarPage";
import TodoPage from "./pages/TodoPage";
import {
  CasesPage,
  LoginPage,
  ClientDashboard,
  RegistrationPage,
  ForgotPass,
} from "./pages";
import ClientsPage from "./pages/ClientsPage";
import AccountsPage from "./pages/AccountsPage";
import ArchivePage from "./pages/ArchivePage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

function AppTest() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/ClientDashboard" element={<ClientDashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/forgotpass" element={<ForgotPass />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default AppTest;
