import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useSearchParams } from "react-router-dom";
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
  });

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-full h-[200px] sm:w-[250px] sm:h-[220px] md:w-[300px] md:h-[250px] m-0">
      {/* Icon and Title */}
      <div className="flex items-center space-x-2 mb-2">
        <ClipboardList className="w-8 h-8 text-red-600 sm:w-10 sm:h-10 md:w-12 md:h-12" />
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">Tasks Due</h2>
      </div>
      {/* Count */}
      <p className="text-2xl font-semibold text-red-600 mb-2 sm:text-3xl md:text-4xl">
        {count1 ? count1 : 0}
      </p>
      {/* Next Task Info */}
      {nextTask && (
        <p className="text-xs text-gray-600 text-center sm:text-sm">
          Next: {nextTask.title} - {nextTask.deadline}
        </p>
      )}
    </div>
  );
};

export default TaskDueCard;
