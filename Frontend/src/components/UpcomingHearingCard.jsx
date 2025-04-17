import React from 'react';
import { Calendar } from 'lucide-react';

const UpcomingHearingCard = ({ count, nextHearing }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-[300px] h-[250px]">
            {/* Icon and Title */}
            <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-12 h-12 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Hearings</h2>
            </div>
            {/* Count */}
            <p className="text-4xl font-semibold text-green-600 mb-2">{count}</p>
            {/* Next Hearing Info */}
            {nextHearing && (
                <p className="text-sm text-gray-600 text-center">
                    Next: {nextHearing.date} - {nextHearing.title}
                </p>
            )}
        </div>
    );
};

export default UpcomingHearingCard;
