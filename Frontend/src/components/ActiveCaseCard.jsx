import React from 'react';
import { Briefcase } from 'lucide-react';

const ActiveCaseCard = ({ count }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center justify-center w-full h-[200px] sm:w-[250px] sm:h-[220px] md:w-[300px] md:h-[250px]">
            <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-8 h-8 text-yellow-600 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">Active Cases</h2>
            </div>
            <p className="text-2xl font-semibold text-yellow-600 sm:text-3xl md:text-4xl">{count}</p>
        </div>
    );
};

export default ActiveCaseCard;
