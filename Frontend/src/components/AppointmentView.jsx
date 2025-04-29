import React from 'react';

const AppointmentView = ({ appointment }) => {
    const placeholderData = {
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        phone: '123-456-7890',
        date: '2023-01-01',
        time: '10:00 AM',
        service: 'Consultation',
        notes: 'No additional notes.',
        location: 'Main Office',
    };

    const data = appointment || placeholderData;

    return (
        <div className="flex-1 bg-white shadow-lg rounded-lg p-8 h-full min-h-full flex flex-col justify-center border border-gray-200"> {/* Add min-h-full */}
            <h2 className="text-2xl font-bold mb-6 text-center text-[#FFB600]">Appointment Details</h2>
            <div className="space-y-4"> {/* Add spacing between items */}
                <p className="text-lg font-medium"><strong>Full Name:</strong> <span className="text-gray-700">{data.fullName}</span></p>
                <p className="text-lg font-medium"><strong>Email:</strong> <span className="text-gray-700">{data.email}</span></p>
                <p className="text-lg font-medium"><strong>Phone Number:</strong> <span className="text-gray-700">{data.phone}</span></p>
                <p className="text-lg font-medium"><strong>Preferred Date:</strong> <span className="text-gray-700">{data.date}</span></p>
                <p className="text-lg font-medium"><strong>Preferred Time:</strong> <span className="text-gray-700">{data.time}</span></p>
                <p className="text-lg font-medium"><strong>Service Type:</strong> <span className="text-gray-700">{data.service}</span></p>
                <p className="text-lg font-medium"><strong>Additional Notes:</strong> <span className="text-gray-700">{data.notes}</span></p>
                <p className="text-lg font-medium"><strong>Location:</strong> <span className="text-gray-700">{data.location}</span></p>
            </div>
        </div>
    );
};

export default AppointmentView;
