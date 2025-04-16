import React from 'react';
import { Briefcase } from 'lucide-react';

const ActiveCaseCard = ({ count }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-[300px] h-[250px]">
            {/* Row container for the icon and heading */}
            <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-12 h-12 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-800">Active Cases</h2>
            </div>
            {/* Count */}
            <p className="text-4xl font-semibold text-yellow-600">{count}</p>
        </div>
    );
};

export default ActiveCaseCard;
