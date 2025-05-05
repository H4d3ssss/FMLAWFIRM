import React, { useState, useEffect } from "react";
import axios from "axios";

const AppointmentScheduling = ({ clientId }) => {
  // Add state variables
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [timeError, setTimeError] = useState("");

  // Fetch existing appointments when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchExistingAppointments();
      // Fetch available times for the selected date (mocked for now)
      setAvailableTimes(["09:00", "10:00", "11:00", "14:00", "15:00"]);
    }
  }, [selectedDate]);

  const fetchExistingAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/appointments/date/${selectedDate}`
      );
      setExistingAppointments(response.data || []);
    } catch (error) {
      console.log("Error fetching existing appointments:", error);
      setExistingAppointments([]);
    }
  };

  // Check for time conflicts when start or end time changes
  useEffect(() => {
    if (startTime && endTime && selectedDate) {
      validateTimeConflict();
    }
  }, [startTime, endTime, existingAppointments]);

  const validateTimeConflict = () => {
    setTimeError("");

    // Validate that end time is after start time
    if (startTime >= endTime) {
      setTimeError("End time must be after start time");
      return false;
    }

    // Convert input times to minutes for easier comparison
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Check for conflicts with existing appointments
    for (const appointment of existingAppointments) {
      const existingStart = timeToMinutes(appointment.startTime);
      const existingEnd = timeToMinutes(appointment.endTime);

      // Check if there's an overlap
      if (
        (newStart >= existingStart && newStart < existingEnd) || // New start time falls within existing appointment
        (newEnd > existingStart && newEnd <= existingEnd) || // New end time falls within existing appointment
        (newStart <= existingStart && newEnd >= existingEnd) // New appointment completely encompasses existing one
      ) {
        setTimeError(
          `Time conflict with existing appointment: ${appointment.eventTitle} (${appointment.startTime} - ${appointment.endTime})`
        );
        return false;
      }
    }

    return true;
  };

  // Helper function to convert time string (HH:MM) to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate time conflicts before submission
    if (!validateTimeConflict()) {
      return; // Stop submission if there's a conflict
    }

    // Validate time range
    if (startTime && endTime && startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const payload = {
      eventTitle: title,
      typeOfEvent: type,
      location,
      notes,
      startTime,
      endTime,
      clientId, // Include clientId
      appointmentDate: selectedDate,
    };

    console.log(payload);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/appointments/appointment-for-client`,
        payload
      ); // route dapat to
      console.log(response);
      if (response.data.success) {
        alert("Appointment Scheduled! Wait for admin's approval.");
        setSelectedDate("");
        setTitle("");
        setType("");
        setLocation("");
        setNotes("");
        setStartTime("");
        setEndTime("");
      } else {
        alert(response.data.message || "Failed to schedule appointment");
      }
    } catch (error) {
      console.log(error);
      alert("Error scheduling appointment. Please try again.");
    }
  };

  return (
    <div className="flex-1 bg-white shadow-md rounded-md p-6 h-full">
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        {/* Appointment Details */}
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            required
          />
        </div>

        {/* Time Range Section */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Appointment Time Range:
          </h3>

          {/* Start Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
              min="08:00"
              max="20:00"
              name="startTime"
            />
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
              min="08:00"
              max="20:00"
              name="endTime"
            />
            <p className="text-xs text-gray-500 mt-1">
              Appointments must not exceed 2 hours
            </p>
          </div>
        </div>

        {/* Time conflict error message */}
        {timeError && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {timeError}
          </div>
        )}

        {/* Existing appointments for the selected date */}
        {existingAppointments.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Existing Appointments on {selectedDate}:
            </h3>
            <div className="max-h-40 overflow-y-auto bg-gray-50 p-2 rounded border">
              {existingAppointments.map((apt, index) => (
                <div key={index} className="text-xs mb-1 p-1 border-b">
                  <span className="font-semibold">{apt.eventTitle}</span>:{" "}
                  {apt.startTime} - {apt.endTime}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title:
          </label>
          <input
            type="text"
            value={title}
            id="title"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Service Type:
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            required
          >
            <option value="">Select a service</option>
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="legal-advice">Legal Advice</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location:
          </label>
          <input
            value={location}
            type="text"
            id="location"
            name="location"
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            required
          />
        </div>

        {/* Additional Notes */}
        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes:
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={!!timeError}
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentScheduling;
