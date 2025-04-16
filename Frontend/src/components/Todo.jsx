import React, { useState, useEffect } from "react";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [dayInput, setDayInput] = useState("Today");
    const [assignedDay, setAssignedDay] = useState(""); // For "This Week" tasks
    const [unfinishedTasks, setUnfinishedTasks] = useState([]);

    // Periodically check if completed tasks need to be auto-deleted
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const updatedTasks = tasks.map((task) => {
                if (task.completed && task.autoDeleteTime && now >= new Date(task.autoDeleteTime)) {
                    return null; // Mark task for deletion
                }
                return task;
            });

            setTasks(updatedTasks.filter((task) => task !== null)); // Remove auto-deleted tasks
        }, 1000);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [tasks]);

    const addTask = () => {
        if (taskInput.trim() !== "") {
            const taskCreationTime = new Date(); // Current time
            setTasks([
                ...tasks,
                {
                    text: taskInput,
                    day: dayInput,
                    assignedDay: dayInput === "This Week" ? assignedDay : "", // Assign day for "This Week"
                    completed: false,
                    creationTime: taskCreationTime,
                    autoDeleteTime: null, // Set when task is completed
                },
            ]);
            setTaskInput("");
            setDayInput("Today");
            setAssignedDay(""); // Reset assigned day
        }
    };

    const handleTaskCompletion = (index) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === index) {
                const now = new Date();
                if (!task.completed) {
                    // Mark as completed and set autoDeleteTime (24 hours later)
                    const autoDeleteTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
                    return { ...task, completed: true, autoDeleteTime };
                } else {
                    // Mark as incomplete and reset autoDeleteTime
                    return { ...task, completed: false, autoDeleteTime: null };
                }
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        setTasks((prev) => prev.filter((_, i) => i !== index));
    };

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
                const assignedDayIndex = dayNames.indexOf(task.assignedDay || task.day);
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

    const dayOptions = ["Today", "Tomorrow", "This Week"];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">Task Manager</h1>
                <div className="flex flex-col md:flex-row mb-4">
                    <input
                        type="text"
                        placeholder="Add a task..."
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0 md:mr-2"
                    />
                    <select
                        value={dayInput}
                        onChange={(e) => setDayInput(e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0"
                    >
                        {dayOptions.map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                    {dayInput === "This Week" && (
                        <select
                            value={assignedDay}
                            onChange={(e) => setAssignedDay(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {dayNames.map((day, index) => {
                                const now = new Date();
                                const currentDayIndex = now.getDay();
                                const isPastDay = index < currentDayIndex; // Disable past days
                                return (
                                    <option key={index} value={day} disabled={isPastDay}>
                                        {day}
                                    </option>
                                );
                            })}
                        </select>
                    )}
                </div>
                <button
                    onClick={addTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                >
                    Add Task
                </button>
            </div>

            {/* This Week Tasks */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">This Week Tasks</h2>
                <ul className="space-y-2">
                    {tasks.map((task, index) => (
                        <li
                            key={index}
                            className={`flex justify-between items-center p-2 rounded-md ${task.completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            <div>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleTaskCompletion(index)}
                                    className="mr-2"
                                />
                                <span>{task.text}</span>
                                <span className="block text-sm text-gray-500">
                                    Assigned: {task.assignedDay || task.day}
                                </span>
                                <span className="block text-sm text-gray-500">
                                    {getRemainingTime(task)}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTask(index)}
                                className="text-red-500 hover:text-red-700 ml-4"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                    {tasks.length === 0 && (
                        <li className="text-gray-500 text-center">No tasks for this week.</li>
                    )}
                </ul>
            </div>

            {/* Unfinished Tasks */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Unfinished Tasks</h2>
                <ul className="space-y-2">
                    {unfinishedTasks.map((task, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center p-2 rounded-md bg-red-100 text-red-700"
                        >
                            <div>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleTaskCompletion(index, true)}
                                    className="mr-2"
                                />
                                <span>{task.text}</span>
                                <span className="block text-sm text-gray-500">
                                    {getRemainingTime(task)}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTask(index, true)}
                                className="text-red-500 hover:text-red-700 ml-4"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                    {unfinishedTasks.length === 0 && (
                        <li className="text-gray-500 text-center">No unfinished tasks.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Todo;
