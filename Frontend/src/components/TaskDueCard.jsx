import React, { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
const TasksDueCard = ({ count, nextTask }) => {
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
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center w-[300px] h-[250px] m-0">
      {/* Icon and Title */}
      <div className="flex items-center space-x-2 mb-2">
        <ClipboardList className="w-12 h-12 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-800">Tasks Due</h2>
      </div>
      {/* Count */}
      <p className="text-4xl font-semibold text-red-600 mb-2">
        {count1 ? count1 : 0}
      </p>
      {/* Next Task Info */}
      {nextTask && (
        <p className="text-sm text-gray-600 text-center">
          Next: {nextTask.title} - {nextTask.deadline}
        </p>
      )}
    </div>
  );
};

export default TasksDueCard;
