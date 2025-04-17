import React, { useState, useEffect } from 'react';

const TaskListCard = () => {
    const [tasks, setTasks] = useState([
        { title: 'Prepare witness list', completed: false, autoDeleteTime: null },
        { title: 'Review discovery documents', completed: false, autoDeleteTime: null },
        { title: 'Schedule deposition', completed: false, autoDeleteTime: null },
    ]);

    // Automatically delete tasks at midnight when completed
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();

            // Filter out tasks that are completed and should be deleted
            const updatedTasks = tasks.filter((task) => {
                return !(task.completed && task.autoDeleteTime && now >= new Date(task.autoDeleteTime));
            });

            setTasks(updatedTasks); // Update the state to remove deleted tasks
        }, 1000);

        // Cleanup interval timer on component unmount
        return () => clearInterval(timer);
    }, [tasks]);

    // Function to toggle task completion
    const toggleTaskCompletion = (index) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === index) {
                const now = new Date();

                if (!task.completed) {
                    // Task is marked as completed; set auto-delete time to midnight next day
                    const nextMidnight = new Date();
                    nextMidnight.setDate(now.getDate() + 1); // Move to the next day
                    nextMidnight.setHours(0, 0, 0, 0); // Set time to 12:00 AM
                    return { ...task, completed: true, autoDeleteTime: nextMidnight };
                } else {
                    // Task is marked as incomplete; reset auto-delete time
                    return { ...task, completed: false, autoDeleteTime: null };
                }
            }
            return task; // Return other tasks as is
        });

        setTasks(updatedTasks); // Update the state with new task statuses
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-4 w-[660px] h-[300px] border border-gray-200">
            <h2 className="text-base font-semibold mb-3">Tasks</h2>
            <ul className="space-y-2 text-sm text-gray-700">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <li key={index} className="flex items-center">
                            {/* Checkbox to toggle task completion */}
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(index)}
                                className="w-4 h-4 rounded border-gray-300 focus:ring-0 cursor-pointer"
                            />
                            <span className={task.completed ? 'line-through text-gray-400 ml-2' : 'ml-2'}>
                                {task.title}
                            </span>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No tasks available</p>
                )}
            </ul>
        </div>
    );
};

export default TaskListCard;

/*
 * Backend Integration Comments:
 *
 * 1. Database Schema:
 *    - Create a database table or collection (e.g., MongoDB, PostgreSQL) to store tasks.
 *      Example fields:
 *         - id: Unique identifier (primary key).
 *         - title: Task description (string).
 *         - completed: Boolean indicating if the task is completed.
 *         - autoDeleteTime: DateTime for auto-deletion at midnight next day (nullable).
 *
 * 2. Fetching Tasks:
 *    - Provide a backend API endpoint to retrieve all tasks (e.g., GET /api/tasks).
 *    - Use a `useEffect` hook to fetch tasks from the database and populate the `tasks` state.
 *
 * 3. Updating Task Completion:
 *    - Provide a PUT endpoint to update task completion status and autoDeleteTime (e.g., PUT /api/tasks/:id).
 *    - Send the updated task data (completed, autoDeleteTime) to the backend when toggling completion.
 *
 * 4. Auto-Deletion:
 *    - Implement a cron job or scheduled task on the backend to periodically delete tasks
 *      with expired autoDeleteTime values.
 *    - Example: Check for expired tasks every hour and remove them from the database.
 *
 * 5. Adding New Tasks:
 *    - Provide a POST endpoint for adding new tasks (e.g., POST /api/tasks).
 *    - Update the frontend to send new task data to the backend when a task is created.
 *
 * 6. Manual Deletion:
 *    - Provide a DELETE endpoint to manually remove tasks (e.g., DELETE /api/tasks/:id).
 *    - Optionally integrate this into the frontend for additional user control.
 *
 * Key Notes:
 * - Ensure backend endpoints follow RESTful conventions.
 * - Handle errors gracefully in both the frontend and backend (e.g., network issues, validation errors).
 * - Use authentication/authorization to secure the API if needed.
 */
