import React from "react";

const TaskListCard = ({ tasks }) => {
    const getRemainingTime = (task) => {
        const now = new Date();
        if (task.completed && task.autoDeleteTime) {
            // Remaining time until auto-deletion
            const diff = new Date(task.autoDeleteTime) - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return diff > 0 ? `${hours}h ${minutes}m until auto-deletion` : "Deleting soon";
        } else {
            // Remaining time to complete the task
            const endOfDay = new Date(now);
            if (task.day === "Today") {
                endOfDay.setHours(23, 59, 59, 999); // End of today
            } else if (task.day === "Tomorrow") {
                endOfDay.setDate(now.getDate() + 1);
                endOfDay.setHours(23, 59, 59, 999); // End of tomorrow
            } else {
                const assignedDayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(
                    task.assignedDay || task.day
                );
                const currentDayIndex = now.getDay();
                const daysUntilAssigned = assignedDayIndex - currentDayIndex;
                endOfDay.setDate(now.getDate() + daysUntilAssigned);
                endOfDay.setHours(23, 59, 59, 999); // End of assigned day
            }

            const diff = endOfDay - now; // Time difference in milliseconds
            const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Extract remaining hours
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return diff > 0 ? `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m to finish` : "Expired";
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-1/2">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Current Tasks</h2>
            <ul className="space-y-2">
                {tasks.length === 0 && (
                    <li className="text-gray-500 text-center">No current tasks available.</li>
                )}
                {tasks.map((task, index) => (
                    <li
                        key={index}
                        className={`flex justify-between items-center p-2 rounded-md ${task.completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        <div>
                            <span>{task.text}</span>
                            <span className="block text-sm text-gray-500">Assigned: {task.assignedDay || task.day}</span>
                            <span className="block text-sm text-gray-500">{getRemainingTime(task)}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskListCard;
