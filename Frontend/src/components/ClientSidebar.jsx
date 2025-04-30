import React, { useState } from "react";
import { Home, Calendar, BriefcaseBusiness } from "lucide-react"; // Import icons
import { Link, useLocation } from "react-router-dom";

const ClientSidebar = () => {
  const location = useLocation(); // Get the current route
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  // Function to check if the current link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed top-1/2 left-0 transform -translate-y-1/2 bg-[#FFB600] text-black shadow-lg z-50 transition-all duration-300 ${
        isHovered ? "w-48" : "w-16"
      }`}
      onMouseEnter={() => setIsHovered(true)} // Expand sidebar on hover
      onMouseLeave={() => setIsHovered(false)} // Collapse sidebar when not hovered
    >
      {/* Sidebar Content */}
      <div className="flex flex-col items-center py-4 space-y-4">
        <Link
          to="/clientdashboard"
          className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${
            isActive("/clientdashboard") ? "bg-[#E68900]" : "hover:bg-[#E68900]"
          }`}
        >
          <Home className="w-6 h-6" />
          {isHovered && (
            <span className="ml-4 text-sm font-medium">Dashboard</span>
          )}
        </Link>

        <Link
          to="/client-appointment" // Ensure correct route
          className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${
            isActive("/client-appointment")
              ? "bg-[#E68900]"
              : "hover:bg-[#E68900]"
          }`}
        >
          <Calendar className="w-6 h-6" />
          {isHovered && (
            <span className="ml-4 text-sm font-medium">Appointments</span>
          )}
        </Link>

        <Link
          to="/client-cases"
          className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${
            isActive("/client-cases") ? "bg-[#E68900]" : "hover:bg-[#E68900]"
          }`}
        >
          <BriefcaseBusiness className="w-6 h-6" />
          {isHovered && <span className="ml-4 text-sm font-medium">Cases</span>}
        </Link>
      </div>
    </div>
  );
};

export default ClientSidebar;
