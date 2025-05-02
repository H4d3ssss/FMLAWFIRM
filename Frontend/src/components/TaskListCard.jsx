import React, { useState, useEffect } from "react";
import axios from "axios";
const TaskListCard = ({ onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);

  // Automatically delete tasks at midnight when completed
  useEffect(() => {
    const getDueTodayTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/tasks/tasks-due-today"
        );
        setTasks(response.data);
        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDueTodayTasks();
  }, []);

  // // useEffect(() => {
  // //   const timer = setInterval(() => {
  // //     const now = new Date();

  // //     // Filter out tasks that are completed and should be deleted
  // //     const updatedTasks = tasks.filter((task) => {
  // //       return !(
  // //         task.completed &&
  // //         task.autoDeleteTime &&
  // //         now >= new Date(task.autoDeleteTime)
  // //       );
  // //     });

  // //     setTasks(updatedTasks); // Update the state to remove deleted tasks
  // //   }, 1000);

  //   // Cleanup interval timer on component unmount
  //   return () => clearInterval(timer);
  // }, [tasks]);

  // Function to toggle task completion
  const toggleTaskCompletion = async (taskId) => {
    console.log(taskId);
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const now = new Date();

        if (!task.completed) {
          const nextMidnight = new Date();
          nextMidnight.setDate(now.getDate() + 1);
          nextMidnight.setHours(0, 0, 0, 0);

          return {
            ...task,
            completed: true,
            autoDeleteTime: nextMidnight,
          };
        } else {
          return {
            ...task,
            completed: false,
            autoDeleteTime: null,
          };
        }
      }
      return task;
    });

    setTasks(updatedTasks);

    try {
      await axios.patch("http://localhost:3000/api/tasks/mark-finished-task", {
        taskId: taskId,
      });
      const refreshed = await axios.get(
        "http://localhost:3000/api/tasks/tasks-due-today"
      );
      setTasks(refreshed.data);

      onTaskUpdate?.();
    } catch (error) {
      console.error("Failed to update task completion:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full h-[250px] sm:w-[500px] sm:h-[300px] md:w-[660px] md:h-[350px] border border-gray-200">
      <h1 className="text-lg font-bold text-gray-800 mb-4 sm:text-xl md:text-2xl">
        Task List
      </h1>
      <div className="border border-gray-300 rounded-md">
        <ul className="m-2 h-40 overflow-y-auto space-y-2 text-xs text-gray-700 sm:text-sm md:text-base">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <li key={index} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleTaskCompletion(task.task_id)}
                  className={`w-6 h-6 flex items-center justify-center rounded-full border text-white font-bold ${
                    task.completed
                      ? "bg-green-500 border-green-500"
                      : "bg-green-300 border-green-300"
                  } hover:scale-105 transition`}
                  title="Mark as complete"
                >
                  ✓
                </button>
                <span
                  className={`ml-1 ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.task_description}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 italic">No tasks available</p>
          )}
        </ul>
      </div>
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
