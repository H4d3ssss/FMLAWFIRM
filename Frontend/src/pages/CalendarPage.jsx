import React from 'react';
import { Navbar, Sidebar, Calendar, Footer } from '../components';

const CalendarPage = () => {
    return (
        <div className="bg-gradient-to-b from-[#F9C545] to-[#FFFFFF] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 p-4">
                <Calendar />
            </div>
            <Footer />
        </div>
    );
};

export default CalendarPage;