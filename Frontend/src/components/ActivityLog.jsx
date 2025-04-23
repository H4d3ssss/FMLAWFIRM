import React from "react";
const ActivityLog = () => {
  const logs = [
    {
      message: "Atty. Smith updated case",
      highlight: "Jackson v. Roberts",
    },
    {
      message: "Added note to case",
      highlight: "Blair Estate Litigation",
    },
    {
      message: "Sent email to client",
      highlight: "John Doe",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md h-full max-h-[400px] overflow-y-auto border border-gray-200 max-w-[1500px] mx-auto">
      {/* Header Bar */}
      <div className="bg-[#FFB600] rounded-t-2xl h-10"></div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Activity Log
        </h2>
        <ul className="space-y-3 text-sm text-gray-700">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <li
                key={index}
                className="bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition"
              >
                {log.message}{" "}
                <span className="font-medium text-black">{log.highlight}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recent activity.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ActivityLog;
