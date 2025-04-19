import React from "react";
import { Search, Settings } from "lucide-react";
import { GoLaw } from "react-icons/go";

const Navbar = () => {
  // Format current date
  const formatDate = () => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  // Format current time
  const formatTime = () => {
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date().toLocaleTimeString("en-US", options);
  };

  return (
    <nav className="bg-[#ffb600] shadow-md py-3 flex items-center justify-between px-18 w-full z-50">
      <div className="flex items-center max-w-2xl w-full">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <GoLaw className="size-12" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Date/Time and User Profile */}
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="text-sm text-gray-800">{formatDate()}</p>
          <p className="text-sm font-medium text-gray-900">{formatTime()}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
