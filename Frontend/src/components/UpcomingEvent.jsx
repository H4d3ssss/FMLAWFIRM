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
  console.log(event);
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-[660px] h-[300px] border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h1>
      <div className="text-gray-600 text-sm space-y-2">
        <div className="border border-gray-300 rounded-md p-3 h-50">
          <p>
            <strong>Title:</strong> {event.event_title}
          </p>
          <p>
            <strong>Type:</strong> {event.type_of_event}
          </p>
          <p>
            <strong>Location:</strong> {event.location || "N/A"}
          </p>
          <p>
            <strong>Notes:</strong> {event.notes || "N/A"}
          </p>
          <p>
            <strong>Start Time:</strong> {event.formatted_start_time}
          </p>
          <p>
            <strong>End Time:</strong> {event.formatted_end_time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
