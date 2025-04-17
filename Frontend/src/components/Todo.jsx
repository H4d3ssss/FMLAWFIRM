import React, { useState, useEffect } from "react";
import axios from "axios";
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Todo = () => {
  const [renderTasks, setRenderTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [dayInput, setDayInput] = useState("Today");
  const [assignedDay, setAssignedDay] = useState(""); // For "This Week" tasks
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/tasks/fetch-inprogress-tasks"
      );
      // console.log(response.data);
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUnfinishedTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/tasks/fetch-unfinished-tasks"
      );
      // console.log(response.data);
      setUnfinishedTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Periodically check if completed tasks need to be auto-deleted
  useEffect(() => {
    fetchTasks();
    fetchUnfinishedTasks();
    console.log("rendering");

    // Cleanup on component unmount
  }, [tasks]); // LAGAY KO ULIT TASKS DITO WAIT

  const addTask = async () => {
    if (taskInput.trim() !== "") {
      const taskCreationTime = new Date(); // Current time
      setTasks([
        ...tasks,
        {
          taskDescription: taskInput,
          day: dayInput || dayToday,
          dueDate: new Date().toISOString().split("T")[0],
          assignedDay: dayInput === "This Week" ? assignedDay : "", // Assign day for "This Week"
          completed: false,
          creationTime: taskCreationTime,
          autoDeleteTime: null, // Set when task is completed
        },
      ]);

      try {
        if (dayInput === "Today") {
          // 📌 INSERT TODAY'S ROUTE HERE
          const response = await axios.post(
            "http://localhost:3000/api/tasks/create-today-task",
            {
              taskDescription: taskInput,
              day: dayNames[new Date().getDay()],
              dueDate: new Date().toISOString().split("T")[0],
              dateCreated: new Date().toISOString().split("T")[0],
            }
          );
        } else if (dayInput === "Tomorrow") {
          // 📌 INSERT TOMORROW'S ROUTE HERE
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          await axios.post(
            "http://localhost:3000/api/tasks/create-tomorrow-task",
            {
              taskDescription: taskInput,
              day: dayNames[new Date().getDay() + 1],
              dueDate: tomorrow.toISOString().split("T")[0],
              dateCreated: new Date().toISOString().split("T")[0],
            }
          );
        } else if (dayInput === "This Week") {
          // 📌 INSERT THIS WEEK'S ROUTE HERE (day picked from dropdown)
          const today = new Date();
          const todayIndex = today.getDay();
          const assignedIndex = dayNames.indexOf(assignedDay);
          const diff = assignedIndex - todayIndex;
          const assignedDate = new Date(today);
          assignedDate.setDate(today.getDate() + diff);

          await axios.post("http://localhost:3000/api/tasks/create-week-task", {
            taskDescription: taskInput,
            day: assignedDay,
            dueDate: assignedDate.toISOString().split("T")[0],
            dateCreated: new Date().toISOString().split("T")[0],
          });
        }
        fetchTasks();
        fetchUnfinishedTasks();
      } catch (error) {
        console.log(error);
      }

      setTaskInput("");
      setDayInput("Today");
      setAssignedDay(""); // Reset assigned day
    }
  };

  const handleTaskCompletion = async (taskId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/tasks/mark-finished-task`,
        { taskId }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    if (tasks.length <= 0) {
      console.log("all tasks done");
      fetchUnfinishedTasks();
    } else if (unfinishedTasks.length <= 0) {
      console.log("all unfinished tasks done");
      fetchTasks();
    } else {
      fetchTasks();
      fetchUnfinishedTasks();
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/tasks/mark-deleted-task",
        { taskId }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    if (tasks.length <= 0) {
      console.log("all tasks done");
      fetchUnfinishedTasks();
    } else if (unfinishedTasks.length <= 0) {
      console.log("all unfinished tasks done");
      fetchTasks();
    } else {
      fetchTasks();
      fetchUnfinishedTasks();
    }
  };

  const getRemainingTime = (task) => {
    const now = new Date();
    if (task.completed && task.autoDeleteTime) {
      // Remaining time until auto-deletion
      const diff = new Date(task.autoDeleteTime) - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return diff > 0
        ? `${hours}h ${minutes}m until auto-deletion`
        : "Deleting soon";
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
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ); // Extract remaining hours
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return diff > 0
        ? `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m to finish`
        : "Expired";
    }
  };

  const dayOptions = ["Today", "Tomorrow", "This Week"];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Task Manager
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
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          This Week Tasks
        </h2>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-2 rounded-md ${
                task.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <div>
                <button
                  onClick={() => handleTaskCompletion(task.task_id)}
                  className="mr-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  ✓
                </button>

                <span>Task Description: {task.task_description}</span>
                <span className="block text-sm text-gray-500">
                  Assigned: {task.assigned}
                </span>
                <span className="block text-sm text-gray-500">
                  Deadline:{task.day_to_be_finished} {task.deadline}
                </span>
                <span className="block text-sm text-gray-500">
                  Current Time:{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="block text-sm text-gray-500">
                  Time Remaining:{" "}
                  {(() => {
                    const now = new Date();
                    const deadline = new Date();
                    deadline.setHours(23, 59, 0, 0); // 11:59 PM today

                    const diff = deadline - now;
                    if (diff <= 0) return "Expired";

                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor(
                      (diff % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    return `${hours}h ${minutes}m`;
                  })()}
                </span>
              </div>
              <button
                onClick={() => {
                  deleteTask(task.task_id);
                  console.log("deleted");
                }}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Delete
              </button>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="text-gray-500 text-center">
              No tasks for this week.
            </li>
          )}
        </ul>
      </div>

      {/* Unfinished Tasks */}
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
              <div>
                <button
                  onClick={() => handleTaskCompletion(task.task_id)}
                  className="mr-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  ✓
                </button>

                <span className="block text-sm text-gray-500">
                  Task Description: {task.task_description}
                </span>
                <span className="block text-sm text-gray-500">
                  Assigned: {task.assigned}
                </span>
                <span className="block text-sm text-gray-500">
                  Due Date:{" "}
                  {new Date(task.due_date_only).toISOString().split("T")[0]}{" "}
                  {task.day_to_be_finished}
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
