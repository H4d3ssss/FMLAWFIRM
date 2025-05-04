import React, { useState, useEffect } from "react";

const AdminApprovalDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Fetch pending appointments
        const fetchAppointments = async () => {
            const response = await fetch("/api/appointments/pending");
            const data = await response.json();
            setAppointments(data);
        };

        fetchAppointments();
        const interval = setInterval(fetchAppointments, 10000); // every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const handleApprove = async (id) => {
        await fetch(`/api/appointments/${id}/approve`, { method: "PUT" });
        setAppointments(appointments.filter((appt) => appt._id !== id));
    };

    const handleReject = async (id) => {
        await fetch(`/api/appointments/${id}/reject`, { method: "PUT" });
        setAppointments(appointments.filter((appt) => appt._id !== id));
    };

    return (
        <div className="p-4 bg-white  shadow-lg border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Pending Appointments</h2>
            <div className="overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 bg-gray-100 p-4 rounded-t-lg font-bold text-gray-700">
                    <div>Client</div>
                    <div>Date</div>
                    <div>Time</div>
                    <div>Service</div>
                    <div>Actions</div>
                </div>
                {appointments.length > 0 ? (
                    appointments.map((appt) => (
                        <div
                            key={appt._id}
                            className="grid grid-cols-5 gap-4 items-center p-4 border-b"
                        >
                            <div>{appt.clientId}</div>
                            <div>{appt.date}</div>
                            <div>{appt.time}</div>
                            <div>{appt.service}</div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleApprove(appt._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(appt._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        No pending appointments.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminApprovalDashboard;