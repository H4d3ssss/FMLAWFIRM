import React from 'react';
import { Briefcase } from 'lucide-react';

const ActiveCaseCard = ({ count }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center justify-center w-[250px] h-[220px] m-0 md:w-[300px] md:h-[250px]">
            <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-10 h-10 text-yellow-600 md:w-12 md:h-12" />
                <h2 className="text-xl font-bold text-gray-800 md:text-2xl">Active Cases</h2>
            </div>
            <p className="text-3xl font-semibold text-yellow-600 md:text-4xl">{count}</p>
        </div>
    );
};

export default ActiveCaseCard;
