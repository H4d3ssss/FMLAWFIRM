import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, Footer, ActiveCaseCard, PendingCaseCard, UpcomingHearingCard, TasksDueCard } from '../components';

const AdminDashboard = () => {
    const [activeCases, setActiveCases] = useState([]);
    const [pendingCases, setPendingCases] = useState([]);
    const [upcomingHearings, setUpcomingHearings] = useState([]);
    const [tasksDue, setTasksDue] = useState([]);

    useEffect(() => {
        // Example: Fetch cases, hearings, and tasks
        const fetchedActiveCases = [
            { id: 1, title: "Case 1", status: "active" },
            { id: 2, title: "Case 2", status: "active" },
        ];
        const fetchedPendingCases = [
            { id: 3, title: "Case 3", status: "pending" },
        ];
        const fetchedUpcomingHearings = [
            { id: 4, title: "Hearing for Case 1", date: "2025-04-20" },
        ];
        const fetchedTasksDue = [
            { id: 5, title: "Submit Financial Report", deadline: "2025-04-18" },
            { id: 6, title: "Prepare Case Notes", deadline: "2025-04-19" },
        ];

        setActiveCases(fetchedActiveCases);
        setPendingCases(fetchedPendingCases);
        setUpcomingHearings(fetchedUpcomingHearings);
        setTasksDue(fetchedTasksDue);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex p-6 mx-60">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                        <div className="mb-5 grid grid-cols-4 gap-0 place-items-center">
                            <ActiveCaseCard count={activeCases.length} />
                            <PendingCaseCard count={pendingCases.length} />
                            <UpcomingHearingCard
                                count={upcomingHearings.length}
                                nextHearing={upcomingHearings[0]} // Pass the first hearing as the next one
                            />
                            <TasksDueCard
                                count={tasksDue.length}
                                nextTask={tasksDue[0]} // Pass the first task as the next one
                            />
                        </div>

                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
