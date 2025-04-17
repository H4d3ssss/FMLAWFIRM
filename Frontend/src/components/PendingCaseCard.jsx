import React from 'react';
import { Clock } from 'lucide-react';

const PendingCaseCard = ({ count }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-[300px] h-[250px] mr-10">
            <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-12 h-12 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Pending Cases</h2>
            </div>
            <p className="text-4xl font-semibold text-blue-600">{count}</p>
        </div>
    );
};

export default PendingCaseCard;
