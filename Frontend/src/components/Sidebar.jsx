import React, { useState } from 'react';
import { Home, Calendar, BriefcaseBusiness, Users, User, CheckSquare, Archive } from 'lucide-react'; // Import icons
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation(); // Get the current route
    const [isHovered, setIsHovered] = useState(false); // State to track hover

    // Function to check if the current link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`fixed top-1/2 left-0 transform -translate-y-1/2 bg-[#FFB600] text-black shadow-lg z-50 transition-all duration-300 ${isHovered ? 'w-48' : 'w-16'
                }`}
            onMouseEnter={() => setIsHovered(true)} // Expand sidebar on hover
            onMouseLeave={() => setIsHovered(false)} // Collapse sidebar when not hovered
        >
            {/* Sidebar Content */}
            <div className="flex flex-col items-center py-4 space-y-4">
                <Link
                    to="/AdminDashboard"
                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${isActive('/AdminDashboard') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                        }`}
                >
                    <Home className="w-6 h-6" />
                    {isHovered && <span className="ml-4 text-sm font-medium">Dashboard</span>}
                </Link>

                <Link
                    to="/calendar"
                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${isActive('/calendar') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                        }`}
                >
                    <Calendar className="w-6 h-6" />
                    {isHovered && <span className="ml-4 text-sm font-medium">Calendar</span>}
                </Link>

                <Link
                    to="/todo"
                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${isActive('/todo') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                        }`}
                >
                    <CheckSquare className="w-6 h-6" />
                    {isHovered && <span className="ml-4 text-sm font-medium">To-Do</span>}
                </Link>

                <Link
                    to="/cases"
                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${isActive('/cases') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                        }`}
                >
                    <BriefcaseBusiness className="w-6 h-6" />
                    {isHovered && <span className="ml-4 text-sm font-medium">Cases</span>}
                </Link>

                <Link
                    to="/clients"
                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${isActive('/clients') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                        }`}
                >
                    <Users className="w-6 h-6" />
                    {isHovered && <span className="ml-4 text-sm font-medium">Clients</span>}
                </Link>

                <Link
                    to="/accounts"
                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${isActive('/accounts') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                        }`}
                >
                    <User className="w-6 h-6" />
                    {isHovered && <span className="ml-4 text-sm font-medium">Accounts</span>}
                </Link>

                <Link
                    to="/archive"
                    className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${isActive('/archive') ? 'bg-[#E68900]' : 'hover:bg-[#E68900]'
                        }`}
                >
                    <Archive className="w-6 h-6" />
                    {isHovered && <span className="ml-4 text-sm font-medium">Archive</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;