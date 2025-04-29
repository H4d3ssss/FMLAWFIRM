import React from 'react';
import ClientNavbar from '../components/ClientNavbar'; // Ensure correct import
import ClientSidebar from '../components/ClientSidebar'; // Ensure correct import
import Footer from '../components/Footer'; // Ensure correct import
import ClientCaseTable from '../components/ClientCaseTable'; // Ensure correct import

const ClientCases = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
            <ClientNavbar /> {/* Ensure ClientNavbar is rendered */}
            <div className="flex flex-1">
                <div className="flex-1 p-6">
                    <div className="flex-1 flex flex-col">
                        <h1 className="text-2xl font-bold text-black">Client Cases</h1>
                        <ClientCaseTable /> {/* Ensure ClientCaseTable is rendered */}
                    </div>
                </div>
            </div>
            <Footer /> {/* Ensure Footer is rendered */}
        </div>
    );
};

export default ClientCases;