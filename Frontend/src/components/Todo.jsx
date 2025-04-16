import React, { useState, useEffect } from "react";

const Todo = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [dayInput, setDayInput] = useState("Today");
    const [unfinishedTasks, setUnfinishedTasks] = useState([]);

    const addTask = () => {
        if (taskInput.trim() !== "") {
            const taskCreationTime = new Date(); // Current time
            setTasks([
                ...tasks,
                {
                    text: taskInput,
                    day: dayInput,
                    completed: false,
                    creationTime: taskCreationTime,
                },
            ]);
            setTaskInput("");
            setDayInput("Today");
        }
    };

    const handleTaskCompletion = (index, isUnfinished = false) => {
        if (isUnfinished) {
            setUnfinishedTasks((prev) => prev.filter((_, i) => i !== index));
        } else {
            const updatedTasks = tasks.map((task, i) =>
                i === index ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);
        }
    };

    const deleteTask = (index, isUnfinished = false) => {
        if (isUnfinished) {
            setUnfinishedTasks((prev) => prev.filter((_, i) => i !== index));
        } else {
            setTasks((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const getRemainingTime = (creationTime) => {
        const now = new Date();
        const endOfTomorrow = new Date(creationTime);
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999); // Tomorrow's midnight

        const diff = endOfTomorrow - now; // Time difference in milliseconds
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return diff > 0 ? `${hours}h ${minutes}m remaining` : "Time's up!";
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();

            const updatedTasks = tasks.filter((task) => {
                const endOfToday = new Date();
                endOfToday.setHours(23, 59, 59, 999); // End of current day

                const isDueToday =
                    task.day === "Today" && now <= endOfToday; // Active until 11:59 PM
                const isDueTomorrow =
                    task.day === "Tomorrow" &&
                    now >= new Date(task.creationTime.getTime() + 24 * 60 * 60 * 1000); // After midnight

                const isDueThisWeek =
                    task.day === "This Week" &&
                    now > new Date(task.creationTime.getTime() + 7 * 24 * 60 * 60 * 1000); // After 7 days

                // Move "Tomorrow" tasks to "Today" at midnight
                if (isDueTomorrow) {
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.text === task.text ? { ...t, day: "Today" } : t
                        )
                    );
                    return false; // Remove from Tomorrow container
                }

                // Move to Unfinished only if overdue
                if (!task.completed && !isDueToday && isDueThisWeek) {
                    setUnfinishedTasks((prev) => {
                        const isAlreadyUnfinished = prev.some((t) => t.text === task.text);
                        return isAlreadyUnfinished ? prev : [...prev, task];
                    });
                    return false;
                }

                return true;
            });

            setTasks(updatedTasks);
        }, 1000);

        return () => clearInterval(timer);
    }, [tasks]);

    const dayOptions = ["Today", "Tomorrow", "This Week"];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
                    Task Manager with Remaining Time
                </h1>
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
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {dayOptions.map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={addTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                >
                    Add Task
                </button>
            </div>

            {/* Active Task List */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Active Tasks</h2>
                <ul className="space-y-2">
                    {tasks
                        .filter((task) => task.day === "Today")
                        .map((task, index) => (
                            <li
                                key={index}
                                className={`flex justify-between items-center p-2 rounded-md ${task.completed
                                    ? "bg-green-100 line-through text-green-500"
                                    : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleTaskCompletion(index)}
                                        className="mr-2"
                                    />
                                    <div className="flex flex-col">
                                        <span>{task.text}</span>
                                        <span className="text-gray-500 text-sm">
                                            Added: {task.creationTime.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteTask(index)}
                                    className="text-red-500 hover:text-red-700 ml-4"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    {tasks.filter((task) => task.day === "Today").length === 0 && (
                        <li className="text-gray-500 text-center">No active tasks.</li>
                    )}
                </ul>
            </div>

            {/* Tomorrow Task List */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Tomorrow Tasks</h2>
                <ul className="space-y-2">
                    {tasks
                        .filter((task) => task.day === "Tomorrow")
                        .map((task, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center p-2 rounded-md bg-blue-100 text-gray-700"
                            >
                                <div className="flex flex-col">
                                    <span>{task.text}</span>
                                    <span className="text-gray-500 text-sm">
                                        Added: {task.creationTime.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {getRemainingTime(task.creationTime)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    {tasks.filter((task) => task.day === "Tomorrow").length === 0 && (
                        <li className="text-gray-500 text-center">No tomorrow tasks.</li>
                    )}
                </ul>
            </div>

            {/* Unfinished Task List */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                    Unfinished Tasks
                </h2>
                <ul className="space-y-2">
                    {unfinishedTasks.map((task, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center p-2 rounded-md bg-red-100 text-red-700"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleTaskCompletion(index, true)}
                                    className="mr-2"
                                />
                                <span>{task.text}</span>
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
