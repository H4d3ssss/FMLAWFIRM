import React, { useState, useEffect } from "react"; // Import React and hooks for state management
import axios from "axios";

// AdminActivityLog Component
// Displays an activity log with fixed height and a scrollable area for long lists
const AdminActivityLog = () => {
  // State for storing activity logs fetched from the backend
  const [activityLogs, setActivityLogs] = useState([]);
  // State for managing loading status
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  /**
   * Function to fetch activity logs from the backend
   * Integrates with an API to retrieve logs in JSON format
   */
  const getActivityLogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/activities/fetch-activities"
      ); // Replace with your API endpoint
      // console.log(response.data);
      setActivityLogs(response.data); // Update state with fetched logs
    } catch (error) {
      console.log(error);
    }
    setLoading(false); // Update loading state to false
  };

  // useEffect hook to fetch activity logs when the component mounts
  useEffect(() => {
    getActivityLogs(); // Trigger the API call
  }, []); // Empty dependency array ensures fetch occurs only once

  // Filter logs based on the search term
  const filteredLogs = activityLogs.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
      {/* Header section for the activity log */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Admin Activity Log
      </h1>
      {/* Search bar for filtering logs */}
      <input
        type="text"
        placeholder="Search by action..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
      />
      <div className="h-64 sm:h-80 overflow-y-auto border border-gray-300 rounded-md">
        {/* Fixed height and scrollable area for overflow */}
        {loading ? (
          // Display loading state while data is being fetched
          <p className="text-gray-600 text-center">Loading...</p>
        ) : filteredLogs.length > 0 ? (
          // Render filtered logs if available
          <ul className="divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <li
                key={index} // Unique key for each log item
                className="flex items-center space-x-4 p-4 hover:bg-gray-50"
              >
                {/* Render an icon based on activity type */}
                <div className="flex-shrink-0">
                  {log.activityType === "update" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 12h2m-2-2h.01m-1.22 7.54a9.003 9.003 0 111.42-.06M15 12h.01"
                      />
                    </svg>
                  )}
                </div>
                {/* Activity details displayed */}
                <div>
                  <p className="text-gray-800 font-semibold">{log.action}</p>
                  <p className="text-sm text-gray-600">
                    • {log.description} {log.target_name} by {log.admin_name} |{" "}
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Display message if no logs match the search
          <p className="text-gray-600 text-center">No activities found</p>
        )}
      </div>
    </div>
  );
};

export default AdminActivityLog;
