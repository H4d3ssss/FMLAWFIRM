import React from 'react';
import AppointmentScheduling from '../components/AppointmentScheduling'; // Import the AppointmentScheduling component
import AppointmentView from '../components/AppointmentView'; // Import AppointmentView
import ClientNavbar from '../components/ClientNavbar'; // Import ClientNavbar
import ClientSidebar from '../components/ClientSidebar'; // Import ClientSidebar
import Footer from '../components/Footer'; // Import Footer

const ClientAppointment = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
            <ClientNavbar /> {/* Add ClientNavbar */}
            <div className="flex flex-1">

                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-4 text-black">Schedule an Appointment</h1>
                    <div className="max-w-6xl mx-auto flex gap-6 items-stretch"> {/* Add items-stretch */}

                        <div className="flex-1 flex flex-col"> {/* Left side */}
                            <div className="flex-1">
                                <AppointmentScheduling />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col"> {/* Right side */}
                            <div className="flex-1">
                                <AppointmentView />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer /> {/* Add Footer */}
        </div>
    );
};

export default ClientAppointment;