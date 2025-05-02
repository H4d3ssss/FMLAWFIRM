import React from 'react';
import { Clock } from 'lucide-react';

const PendingCaseCard = ({ count }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center w-full h-full min-h-[180px]">
            <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-10 h-10 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Pending Cases</h2>
            </div>
            <p className="text-3xl font-semibold text-blue-600">{count}</p>
        </div>
    );
};

export default PendingCaseCard;