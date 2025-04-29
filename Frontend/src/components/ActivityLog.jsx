import React from "react";

const ActivityLog = ({ activities }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Activity Log</h2>
      {activities && activities.length > 0 ? (
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li
              key={index}
              className="border-b last:border-none pb-2 text-gray-700"
            >
              <p className="text-sm">
                <strong>{activity.title}</strong> - {activity.description}
              </p>
              <p className="text-xs text-gray-500">
                {activity.date} | {activity.time}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No recent activities.</p>
      )}
    </div>
  );
};

export default ActivityLog;
