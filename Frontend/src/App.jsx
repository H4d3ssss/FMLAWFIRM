import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDashboard from "./pages/ClientDashboard"; // Import ClientDashboard
import ClientCases from "./pages/ClientCases"; // Import ClientCases
import ClientAppointment from "./pages/ClientAppointment.jsx"; // Import ClientAppointment
import ClientSidebar from "./components/ClientSidebar"; // Import ClientSidebar

function App() {
  return (
    <Router>
      <div className="flex">
        <ClientSidebar /> {/* Add sidebar for all pages */}
        <div className="flex-1">
          <Routes>
            {/* ...existing routes... */}
            <Route path="/" element={<ClientDashboard />} /> {/* Default route */}
            <Route path="/clientdashboard" element={<ClientDashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/client-cases" element={<ClientCases />} />
            <Route path="/client-appointment" element={<ClientAppointment />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
