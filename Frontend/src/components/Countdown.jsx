import { useEffect, useState } from "react";

function Countdown({ dueDate, taskId, handleUnfinishedTask, setCount }) {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const deadline = new Date(dueDate);
      deadline.setHours(23, 59, 0, 0); // or your desired fixed time

      const diff = deadline - now;

      if (diff <= 0) {
        handleUnfinishedTask(taskId);
        setCount((prev) => prev + 1);
        setTimeRemaining("Deadline Passed");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      }
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [dueDate, taskId, handleUnfinishedTask, setCount]);

  return (
    <span className="block text-sm text-gray-500">
      Time Remaining: {timeRemaining}
    </span>
  );
}

export default Countdown;
