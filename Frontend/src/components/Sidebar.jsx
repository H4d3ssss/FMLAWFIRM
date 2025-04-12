import React, { useState } from 'react';
import { Menu, X, Home, Users, Mail, Calendar, BriefcaseBusiness, User } from 'lucide-react';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarOpen = () => {
        setSidebarOpen(true);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div
            className={`z-50 fixed top-1/2 left-0 -translate-y-1/2 flex ${sidebarOpen ? 'bg-[#FFB600]' : ''}`}
        >
            <div
                className={`bg-[#FFB600] text-black overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'
                    }`}
            >
                <div className="p-4 space-y-4">
                    <button className="sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors hover:bg-[#E68900]">
                        <Home className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Home</span>
                    </button>

                    <button className="sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors hover:bg-[#E68900]">
                        <Calendar className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Calendar</span>
                    </button>

                    <button className="sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors hover:bg-[#E68900]">
                        <BriefcaseBusiness className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Cases</span>
                    </button>

                    <button className="sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors hover:bg-[#E68900]">
                        <Users className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Clients</span>
                    </button>

                    <button className="sidebar-item group flex items-center w-full p-2 rounded-lg transition-colors hover:bg-[#E68900]">
                        <User className="w-5 h-5 mr-3" />
                        <span className="text-sm font-medium">Accounts</span>
                    </button>
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