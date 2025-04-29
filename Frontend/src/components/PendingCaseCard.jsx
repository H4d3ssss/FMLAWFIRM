import React from 'react';
import { Clock } from 'lucide-react';

const PendingCaseCard = ({ count }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-full h-[200px] sm:w-[250px] sm:h-[220px] md:w-[300px] md:h-[250px] m-0">
            <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-8 h-8 text-blue-600 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">Pending Cases</h2>
            </div>
            <p className="text-2xl font-semibold text-blue-600 sm:text-3xl md:text-4xl">{count}</p>
        </div>

    );
};

export default PendingCaseCard;
