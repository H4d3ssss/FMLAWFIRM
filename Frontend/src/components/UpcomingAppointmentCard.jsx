import React from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

const UpcomingAppointmentCard = ({ date, time, clientName, location }) => {
    return (
        <div className="border border-gray-300 rounded-lg p-4 w-full sm:max-w-sm shadow-md">
            <h3 className="mb-3 text-base font-semibold text-gray-800 sm:text-lg">Upcoming Appointment</h3>
            <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <strong>Date:</strong> {date}
            </p>
            <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <strong>Time:</strong> {time}
            </p>
            <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <strong>Client:</strong> {clientName}
            </p>
            <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <strong>Location:</strong> {location}
            </p>
        </div>
    );
};

export default UpcomingAppointmentCard;
