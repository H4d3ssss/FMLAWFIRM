import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import axios from "axios";

const TaskDueCard = ({ count, nextTask }) => {
  const [count1, setCount1] = useState(0);

  useEffect(() => {
    const getTasksToday = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/tasks/tasks-due-today"
        );
        setCount1(response.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    getTasksToday();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center w-full h-full min-h-[180px]">
      <div className="flex items-center space-x-2 mb-4">
        <ClipboardList className="w-10 h-10 text-red-600" />
        <h2 className="text-xl font-bold text-gray-800">Tasks Due</h2>
      </div>
      <p className="text-3xl font-semibold text-red-600 mb-2">
        {count1 ? count1 : 0}
      </p>
      {nextTask && (
        <p className="text-sm text-gray-600 text-center">
          Next: {nextTask.title} - {nextTask.deadline}
        </p>
      )}
    </div>
  );
};

export default TaskDueCard;
