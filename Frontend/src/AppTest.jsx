import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import CalendarPage from "./pages/CalendarPage";
import TodoPage from "./pages/TodoPage";
import { CasesPage, LoginPage, ClientDashboard } from "./pages";
import ClientsPage from "./pages/ClientsPage";
import ViewFile from "./components/ViewFile";

function AppTest() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/ClientDashboard" element={<ClientDashboard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/view-file/:filename" element={<ViewFile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default AppTest;
