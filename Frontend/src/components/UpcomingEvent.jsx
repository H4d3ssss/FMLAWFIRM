import React, { useEffect, useState } from "react";
import axios from "axios";

const UpcomingEvent = () => {
  // State to hold event data fetched from the backend
  const [eventData, setEventData] = useState("");

  useEffect(() => {
    const soonestAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments/soonest-appointment"
        );
        console.log(response.data);
        setEventData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    soonestAppointments();
  }, []);

  useEffect(() => {
    // Placeholder for backend API call
    // Backend developer: Replace the URL below with the actual API endpoint
    // fetch("/api/events/upcoming")
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch event data");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setEventData(data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching event data:", error);
    //     // Fallback to default event data in case of an error
    //     setEventData({
    //       title: "No Title Available",
    //       type: "No Type Specified",
    //       location: "No Location Provided",
    //       notes: "No Notes Added",
    //       startTime: "Not Scheduled",
    //       endTime: "Not Scheduled",
    //     });
    //   });
  }, []);

  // Default event data to avoid errors if no data is fetched
  const defaultEvent = {
    event_title: "No Title Available",
    type_of_event: "No Type Specified",
    location: "No Location Provided",
    notes: "No Notes Added",
    start_time: "Not Scheduled",
    end_time: "Not Scheduled",
  };

  const eventArray =
    Array.isArray(eventData) && eventData.length > 0
      ? eventData
      : [defaultEvent];
  const event = eventArray[0]; // Use fetched event or fallback to default

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Next Event</h2>

        <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
          {event ? (
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{event.event_title || "No Title Available"}</p>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
                <p><span className="font-medium">Type:</span></p>
                <p>{event.type_of_event || "N/A"}</p>

                <p><span className="font-medium">Client:</span></p>
                <p>{event.client_name || "N/A"}</p>

                <p><span className="font-medium">Location:</span></p>
                <p>{event.location || "N/A"}</p>

                <p><span className="font-medium">Date:</span></p>
                <p>{event.formatted_date || "N/A"}</p>

                <p><span className="font-medium">Time:</span></p>
                <p>{event.formatted_start_time || "N/A"} - {event.formatted_end_time || "N/A"}</p>
              </div>

              {event.notes && (
                <div className="mt-2">
                  <p className="font-medium text-gray-900">Notes:</p>
                  <p className="text-gray-600 text-sm mt-1">{event.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No upcoming events scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;