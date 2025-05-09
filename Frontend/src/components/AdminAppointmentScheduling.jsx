import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminAppointmentScheduling = ({ isOpen, onClose }) => {
  const [clients, setClients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lawyerId, setLawyerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [timeError, setTimeError] = useState("");
  const [errors, setErrors] = useState({
    title: false,
    type: false,
    location: false,
    startTime: false,
    endTime: false,
    lawyerId: false,
    clientId: false,
    date: false
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        setErrors(prev => ({ ...prev, title: !value.trim() }));
        break;
      case 'type':
        setErrors(prev => ({ ...prev, type: !value }));
        break;
      case 'location':
        setErrors(prev => ({ ...prev, location: !value.trim() }));
        break;
      case 'startTime':
        setErrors(prev => ({ ...prev, startTime: !value }));
        break;
      case 'endTime':
        setErrors(prev => ({ ...prev, endTime: !value }));
        break;
      case 'lawyerId':
        setErrors(prev => ({ ...prev, lawyerId: !value }));
        break;
      case 'clientId':
        setErrors(prev => ({ ...prev, clientId: !value }));
        break;
      case 'date':
        setErrors(prev => ({ ...prev, date: !value }));
        break;
    }
  };

  useEffect(() => {
    fetchActiveLawyers();
    fetchApprovedClients();
  }, []);

  const fetchActiveLawyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/lawyers/active-lawyers"
      );
      setStaff(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApprovedClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/clients/approved-clients`
      );
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch existing appointments when date or lawyer changes
  useEffect(() => {
    if (selectedDate && lawyerId) {
      fetchExistingAppointments();
    }
  }, [selectedDate, lawyerId]);

  const fetchExistingAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/appointments/date/${selectedDate}/lawyer/${lawyerId}`
      );
      setExistingAppointments(response.data || []);
    } catch (error) {
      console.log("Error fetching existing appointments:", error);
      setExistingAppointments([]);
    }
  };

  // Check for time conflicts when start or end time changes
  useEffect(() => {
    if (startTime && endTime && selectedDate && lawyerId) {
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
        setTimeError(`Time conflict with existing appointment: ${appointment.eventTitle} (${appointment.startTime} - ${appointment.endTime})`);
        return false;
      }
    }

    return true;
  };

  // Helper function to convert time string (HH:MM) to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {
      title: !title.trim(),
      type: !type,
      location: !location.trim(),
      startTime: !startTime,
      endTime: !endTime,
      lawyerId: !lawyerId,
      clientId: !clientId,
      date: !selectedDate
    };

    setErrors(newErrors);

    // Check if any errors exist
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Validate time conflicts before submission
    if (!validateTimeConflict()) {
      return; // Stop submission if there's a conflict
    }

    const payload = {
      eventTitle: title,
      typeOfEvent: type,
      location,
      notes,
      startTime,
      endTime,
      lawyerId,
      clientId,
      appointmentDate: selectedDate,
    };

    console.log(payload);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/appointments`,
        payload
      );
      console.log(response);
      if (response.data.success) {
        alert("Appointment Scheduled by Admin successfully!");
        onClose();
      } else {
        alert(response.data.message || "Failed to schedule appointment");
      }
    } catch (error) {
      console.log(error);
      alert("Error scheduling appointment. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 bg-[#FFB600]">
          <h2 className="text-lg font-bold">Admin Appointment Scheduling</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Client Selection */}
          <div className="mb-4">
            <label
              htmlFor="client"
              className="block text-sm font-medium text-gray-700"
            >
              Select Client:
            </label>
            <select
              id="client"
              name="client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.client_id}>
                  {client.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Lawyer Assignment */}
          <div className="mb-4">
            <label
              htmlFor="lawyer"
              className="block text-sm font-medium text-gray-700"
            >
              Assign Lawyer:
            </label>
            <select
              id="lawyer"
              name="lawyer"
              value={lawyerId}
              onChange={(e) => setLawyerId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
            >
              <option value="">Select a lawyer</option>
              {staff.map((lawyer) => (
                <option key={lawyer.id} value={lawyer.lawyer_id}>
                  {lawyer.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Date */}
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          {/* Start Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="w-full p-2 border rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
              min="08:00"
              max="20:00"
              name="endTime"
            />
          </div>

          {/* Time conflict error message */}
          {timeError && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {timeError}
            </div>
          )}

          {/* Existing appointments for the selected date and lawyer */}
          {existingAppointments.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Existing Appointments on {selectedDate}:
              </h3>
              <div className="max-h-40 overflow-y-auto bg-gray-50 p-2 rounded border">
                {existingAppointments.map((apt, index) => (
                  <div key={index} className="text-xs mb-1 p-1 border-b">
                    <span className="font-semibold">{apt.eventTitle}</span>: {apt.startTime} - {apt.endTime}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Event Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors(prev => ({ ...prev, title: false }));
              }}
              className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2
                ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">Title is required</p>
            )}
          </div>

          {/* Service Type */}
          <div className="mb-4">
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700"
            >
              Service Type:
            </label>
            <select
              id="service"
              name="service"
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
            >
              <option value="">Select a service</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Legal-advice">Legal Advice</option>
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location:
            </label>
            <input
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
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Schedule Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAppointmentScheduling;
