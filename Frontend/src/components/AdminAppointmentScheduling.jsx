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
    date: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetchActiveLawyers();
      fetchApprovedClients();
    }
  }, [isOpen]);

  const fetchActiveLawyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/lawyers/active-lawyers"
      );

      if (Array.isArray(response.data)) {
        setStaff(response.data);
      } else if (response.data && Array.isArray(response.data.response)) {
        setStaff(response.data.response);
      } else if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.message)
      ) {
        setStaff(response.data.message);
      } else {
        console.log("Unexpected lawyer data format:", response.data);
        setStaff([]);
      }
    } catch (error) {
      console.log("Error fetching lawyers:", error);
      setStaff([]);
    }
  };

  const fetchApprovedClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/clients/approved-clients`
      );

      if (Array.isArray(response.data)) {
        setClients(response.data);
      } else if (response.data && Array.isArray(response.data.response)) {
        setClients(response.data.response);
      } else if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.message)
      ) {
        setClients(response.data.message);
      } else {
        console.log("Unexpected client data format:", response.data);
        setClients([]);
      }
    } catch (error) {
      console.log("Error fetching clients:", error);
      setClients([]);
    }
  };

  useEffect(() => {
    if (selectedDate && lawyerId) {
      fetchExistingAppointments();
    }
  }, [selectedDate, lawyerId]);

  const fetchExistingAppointments = async () => {
    try {
      if (!selectedDate || !lawyerId) {
        setExistingAppointments([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/appointments/date/${selectedDate}/lawyer/${lawyerId}`
      );

      if (Array.isArray(response.data)) {
        setExistingAppointments(response.data);
      } else if (response.data && Array.isArray(response.data.response)) {
        setExistingAppointments(response.data.response);
      } else if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.message)
      ) {
        setExistingAppointments(response.data.message);
      } else {
        console.log(
          "No existing appointments or unexpected format:",
          response.data
        );
        setExistingAppointments([]);
      }
    } catch (error) {
      console.log("Error fetching existing appointments:", error);
      setExistingAppointments([]);
    }
  };

  useEffect(() => {
    if (startTime && endTime && selectedDate && lawyerId) {
      validateTimeConflict();
    }
  }, [startTime, endTime, existingAppointments]);

  const validateTimeConflict = () => {
    setTimeError("");

    if (startTime >= endTime) {
      setTimeError("End time must be after start time");
      return false;
    }

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    for (const appointment of existingAppointments) {
      if (!appointment.startTime || !appointment.endTime) {
        console.log("Appointment missing time data:", appointment);
        continue;
      }

      const existingStart = timeToMinutes(appointment.startTime);
      const existingEnd = timeToMinutes(appointment.endTime);

      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        setTimeError(
          `Time conflict with existing appointment: ${
            appointment.eventTitle || "Unnamed"
          } (${appointment.startTime} - ${appointment.endTime})`
        );
        return false;
      }
    }

    return true;
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") {
      console.error("Invalid time string:", timeStr);
      return 0;
    }

    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      title: !title.trim(),
      type: !type,
      location: !location.trim(),
      startTime: !startTime,
      endTime: !endTime,
      lawyerId: !lawyerId,
      clientId: !clientId,
      date: !selectedDate,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    if (!validateTimeConflict()) {
      return;
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

    console.log("Submitting appointment:", payload);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/appointments`,
        payload
      );

      if (response.data && response.data.success) {
        alert("Appointment Scheduled by Admin successfully!");

        setTitle("");
        setType("");
        setLocation("");
        setNotes("");
        setStartTime("");
        setEndTime("");
        setLawyerId("");
        setClientId("");
        setSelectedDate("");
        setTimeError("");
        setErrors({
          title: false,
          type: false,
          location: false,
          startTime: false,
          endTime: false,
          lawyerId: false,
          clientId: false,
          date: false,
        });

        onClose();
      } else {
        alert(response.data?.message || "Failed to schedule appointment");
      }
    } catch (error) {
      console.log("Error scheduling appointment:", error);
      alert("Error scheduling appointment. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-green-400 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Admin Appointment Scheduling</h2>
          <button
            onClick={onClose}
            className="text-black text-xl font-bold cursor-pointer"
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

        {/* Modal Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Client */}
                <div>
                  <label htmlFor="client" className="block text-sm font-medium">
                    Select Client:
                  </label>
                  <select
                    id="client"
                    name="client"
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value);
                      setErrors((prev) => ({ ...prev, clientId: false }));
                    }}
                    onBlur={() => {
                      if (clientId.trim() === "") {
                        setErrors((prev) => ({ ...prev, clientId: true }));
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2
                      ${errors.clientId ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option
                        key={client.client_id || client.id}
                        value={client.client_id}
                      >
                        {client.full_name}
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="text-red-500 text-xs mt-1">Client is required</p>
                  )}
                </div>

                {/* Lawyer */}
                <div>
                  <label htmlFor="lawyer" className="block text-sm font-medium">
                    Assign Lawyer:
                  </label>
                  <select
                    id="lawyer"
                    name="lawyer"
                    value={lawyerId}
                    onChange={(e) => {
                      setLawyerId(e.target.value);
                      setErrors((prev) => ({ ...prev, lawyerId: false }));
                    }}
                    onBlur={() => {
                      if (lawyerId.trim() === "") {
                        setErrors((prev) => ({ ...prev, lawyerId: true }));
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2
                      ${errors.lawyerId ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  >
                    <option value="">Select a lawyer</option>
                    {staff.map((lawyer) => (
                      <option
                        key={lawyer.lawyer_id || lawyer.id}
                        value={lawyer.lawyer_id}
                      >
                        {lawyer.full_name}
                      </option>
                    ))}
                  </select>
                  {errors.lawyerId && (
                    <p className="text-red-500 text-xs mt-1">Lawyer is required</p>
                  )}
                </div>

                {/* Preferred Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium">
                    Preferred Date:
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setErrors((prev) => ({ ...prev, date: false }));
                    }}
                    onBlur={() => {
                      if (selectedDate.trim() === "") {
                        setErrors((prev) => ({ ...prev, date: true }));
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2
                      ${errors.date ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">Date is required</p>
                  )}
                </div>

                {/* Service Type */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium">
                    Service Type:
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setErrors((prev) => ({ ...prev, type: false }));
                    }}
                    onBlur={() => {
                      if (type.trim() === "") {
                        setErrors((prev) => ({ ...prev, type: true }));
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2
                      ${errors.type ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Legal-advice">Legal Advice</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-xs mt-1">Service type is required</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Event Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium">
                    Event Title:
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (e.target.value.trim() !== "") {
                        setErrors((prev) => ({ ...prev, title: false }));
                      }
                    }}
                    onBlur={() => {
                      if (title.trim() === "") {
                        setErrors((prev) => ({ ...prev, title: true }));
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2
                      ${errors.title ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">Title is required</p>
                  )}
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setErrors((prev) => ({ ...prev, startTime: false }));
                    }}
                    onBlur={() => {
                      if (startTime.trim() === "") {
                        setErrors((prev) => ({ ...prev, startTime: true }));
                      }
                    }}
                    className={`w-full p-2 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.startTime ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                    min="08:00"
                    max="20:00"
                    name="startTime"
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-xs mt-1">Start time is required</p>
                  )}
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setErrors((prev) => ({ ...prev, endTime: false }));
                    }}
                    onBlur={() => {
                      if (endTime.trim() === "") {
                        setErrors((prev) => ({ ...prev, endTime: true }));
                      }
                    }}
                    className={`w-full p-2 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.endTime ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                    min="08:00"
                    max="20:00"
                    name="endTime"
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-xs mt-1">End time is required</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium">
                    Location:
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setErrors((prev) => ({ ...prev, location: false }));
                    }}
                    onBlur={() => {
                      if (location.trim() === "") {
                        setErrors((prev) => ({ ...prev, location: true }));
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2
                      ${errors.location ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">Location is required</p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes, Errors, Existing Appointments, Submit */}
            <div className="mt-8 space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium">
                  Additional Notes:
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                ></textarea>
              </div>

              {timeError && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {timeError}
                </div>
              )}

              {existingAppointments.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Existing Appointments on {selectedDate}:
                  </h3>
                  <div className="max-h-40 overflow-y-auto bg-gray-50 p-2 rounded border">
                    {existingAppointments.map((apt, index) => (
                      <div
                        key={index}
                        className="text-xs mb-1 p-1 border-b"
                      >
                        <span className="font-semibold">
                          {apt.eventTitle || "Unnamed"}
                        </span>
                        : {apt.startTime || "No start time"} -{" "}
                        {apt.endTime || "No end time"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full bg-green-400 hover:bg-blue-600 text-black py-2 px-4 rounded transition-colors duration-200`}
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentScheduling;
