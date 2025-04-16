import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ActiveCaseCard from '../components/ActiveCaseCard';

const AdminDashboard = () => {
    // Assume this data is fetched or populated dynamically.
    const [activeCases, setActiveCases] = useState([]);

    // Example: Simulate fetching active cases with a useEffect.
    useEffect(() => {
        // In a real scenario, replace this with an API call.
        const fetchedCases = [
            { id: 1, title: "Case 1", status: "active" },
            { id: 2, title: "Case 2", status: "active" },
            { id: 3, title: "Case 3", status: "active" },
        ];
        setActiveCases(fetchedCases);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
            {/* Navbar */}
            <Navbar />

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex p-6 mx-60">
                    {/* Main content container with margins that do not affect Navbar/Sidebar/Footer */}
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                        {/* Active Case Count Card directly under the H1 */}
                        <div className="mb-6 flex justify-center">
                            <ActiveCaseCard count={activeCases.length} />
                        </div>

                        {/* Additional Dashboard Content */}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AdminDashboard;
