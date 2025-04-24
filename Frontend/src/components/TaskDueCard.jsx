import React from 'react';
import { ClipboardList } from 'lucide-react';

const TaskDueCard = ({ count, nextTask }) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-[300px] h-[250px] m-0">
            {/* Icon and Title */}
            <div className="flex items-center space-x-2 mb-2">
                <ClipboardList className="w-12 h-12 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-800">Tasks Due</h2>
            </div>
            {/* Count */}
            <p className="text-4xl font-semibold text-red-600 mb-2">{count}</p>
            {/* Next Task Info */}
            {nextTask && (
                <p className="text-sm text-gray-600 text-center">
                    Next: {nextTask.title} - {nextTask.deadline}
                </p>
            )}
        </div>
    );
};

export default TaskDueCard;
