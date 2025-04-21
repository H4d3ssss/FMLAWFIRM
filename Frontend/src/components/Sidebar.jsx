import React, { useState } from 'react';
import { Menu, X, Home, Users, Mail, Calendar, BriefcaseBusiness, User, Archive, CheckSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(false); // Added state for dropdown
    const location = useLocation(); // Get the current route

    const handleSidebarOpen = () => {
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    // Function to check if the current link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`z-50 fixed top-1/2 left-0 -translate-y-1/2 flex ${sidebarOpen ? 'bg-[#FFB600]' : ''}`}
        >
            <div
                className={`bg-[#FFB600] text-black overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'
                    }`}
            >
                <div className="p-4 space-y-4">
                    <Link
                        to="/AdminDashboard"
                        className={`sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors ${isActive('/AdminDashboard') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                            }`}
                    >
                        <Home className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    {/* Dropdown Toggle */}
                    <button
                        className="sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors hover:bg-[#E68900]"
                        onClick={() => setCalendarDropdownOpen(!calendarDropdownOpen)}
                    >
                        <Calendar className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Calendar</span>
                    </button>
                    {/* Dropdown Items */}
                    {calendarDropdownOpen && (
                        <div className="pl-8 space-y-2">
                            <Link
                                to="/calendar"
                                className={`sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors ${isActive('/calendar') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                                    }`}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">View Calendar</span>
                            </Link>
                            <Link
                                to="/todo"
                                className={`sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors ${isActive('/todo') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                                    }`}
                            >
                                <CheckSquare className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">To-Do</span>
                            </Link>
                        </div>
                    )}
                    <Link
                        to="/cases"
                        className={`sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors ${isActive('/cases') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                            }`}
                    >
                        <BriefcaseBusiness className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Cases</span>
                    </Link>
                    <Link
                        to="/clients"
                        className={`sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors ${isActive('/clients') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                            }`}
                    >
                        <Users className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Clients</span>
                    </Link>
                    <Link
                        to="/accounts"
                        className={`sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors ${isActive('/accounts') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                            }`}
                    >
                        <User className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Accounts</span>
                    </Link>
                    <Link
                        to="/archives"
                        className={`sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors ${isActive('/archives') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                            }`}
                    >
                        <Archive className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Archives</span>
                    </Link>
                </div>
            </div>

            <button
                className="z-10 bg-[#FFB600] text-black w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#E68900]"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                {sidebarOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>
        </div>
    );
};

export default Sidebar;