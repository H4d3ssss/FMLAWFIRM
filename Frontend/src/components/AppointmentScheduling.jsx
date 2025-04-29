import React from 'react';

const AppointmentScheduling = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appointmentData = Object.fromEntries(formData.entries());
        console.log('Appointment Data:', appointmentData);
        alert('Appointment Scheduled! Check the console for details.');
    };

    return (
        <div className="flex-1 bg-white shadow-md rounded-md p-6 h-full"> {/* Add h-full */}
            <form
                onSubmit={handleSubmit}
                className="h-full flex flex-col justify-between"
            >
                {/* User Information */}
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                </div>

                {/* Appointment Details */}
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Preferred Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Type:</label>
                    <select
                        id="service"
                        name="service"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    >
                        <option value="">Select a service</option>
                        <option value="consultation">Consultation</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="legal-advice">Legal Advice</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                </div>

                {/* Additional Notes */}
                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Schedule Appointment
                </button>
            </form>
        </div>
    );
};

export default AppointmentScheduling;
