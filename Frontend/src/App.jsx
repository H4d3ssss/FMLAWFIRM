import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ClientDashboard from "./pages/ClientDashboard"; // Import ClientDashboard
import ClientCases from "./pages/ClientCases"; // Import ClientCases
import ClientAppointment from "./pages/ClientAppointment"; // Import ClientAppointment
import AdminDashboard from "./pages/AdminDashboard"; // Import AdminDashboard
import CasesPage from "./pages/CasesPage"; // Import CasesPage
import ArchivePage from "./pages/ArchivePage"; // Import ArchivePage
import AccountsPage from "./pages/AccountsPage"; // Import AccountsPage
import TermsPage from "./pages/TermsPage"; // Import TermsPage
import PrivacyPage from "./pages/PrivacyPage"; // Import PrivacyPage
import ForgotPass from "./pages/ForgotPass"; // Import ForgotPass
import RegistrationPage from "./pages/RegistrationPage"; // Import RegistrationPage
import ClientsPage from "./pages/ClientsPage"; // Import ClientsPage
import TodoPage from "./pages/TodoPage"; // Import TodoPage
import CalendarPage from "./pages/CalendarPage"; // Import CalendarPage
import LoginPage from "./pages/LoginPage"; // Import LoginPage
import ClientSidebar from "./components/ClientSidebar"; // Import ClientSidebar
import Sidebar from "./components/Sidebar"; // Import Sidebar for admin

function App() {
  const location = useLocation(); // Get the current route

  // Define routes where the ClientSidebar and Sidebar should appear
  const clientRoutes = [
    "/client-dashboard",
    "/client-cases",
    "/client-appointment",
  ];
  const adminRoutes = [
    "/admindashboard",
    "/cases",
    "/archive",
    "/accounts",
    "/clients",
    "/todo",
    "/calendar",
  ];

  return (
    <div className="flex">
      {clientRoutes.includes(location.pathname) && <ClientSidebar />}{" "}
      {/* Conditionally render ClientSidebar */}
      {adminRoutes.includes(location.pathname) && <Sidebar />}{" "}
      {/* Conditionally render Sidebar for admin */}
      <div className="flex-1">
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<LoginPage />} /> {/* Default route */}
          <Route path="/clientdashboard" element={<ClientDashboard />} />
          <Route path="/client-cases" element={<ClientCases />} />
          <Route path="/client-appointment" element={<ClientAppointment />} />
          {/* Admin Routes */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          {/* Shared Routes */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/forgotpass" element={<ForgotPass />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
