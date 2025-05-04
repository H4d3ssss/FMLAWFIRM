import React, { useState, useEffect } from "react";
import axios from "axios";
const AdminApprovalDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Fetch pending appointments
        const fetchAppointments = async () => {
            const response = await axios.get(
                "http://localhost:3000/api/appointments/for-approval"
            );
            setAppointments(response.data);
            console.log(response.data);
        };

        fetchAppointments();
        const interval = setInterval(fetchAppointments, 10000); // every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await axios.patch(
                "http://localhost:3000/api/appointments/approve-appointment",
                { appointmentId: id }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await axios.patch(
                "http://localhost:3000/api/appointments/cancel-appointment",
                { appointmentId: id }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-4 bg-white  shadow-lg border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Pending Appointments</h2>
            <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-4 bg-gray-100 p-4 rounded-t-lg font-bold text-gray-700">
                    <div>Client</div>
                    <div>Date</div>
                    <div>Start Time</div>
                    <div>End Time</div>
                    <div>Service</div>
                    <div>Actions</div>
                </div>
                {appointments.length > 0 ? (
                    appointments.map((appt) => (
                        <div
                            key={appt.appointment_id}
                            className="grid grid-cols-7 gap-4 items-center p-4 border-b"
                        >
                            <div>{appt.client}</div>
                            <div>{appt.appointment_date}</div>
                            <div>{appt.start_time}</div>
                            <div>{appt.end_time}</div>
                            <div>{appt.type_of_event}</div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleApprove(appt.appointment_id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(appt.appointment_id)}
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
