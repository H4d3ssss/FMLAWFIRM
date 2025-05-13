import React, { useState, useEffect } from "react";
import axios from "axios";
const eventTypes = [
  "Consultation",
  "Meeting",
  "Case Hearing",
  "Filing",
  "Follow-up",
  "Other",
];
const eventTypeColors = {
  Consultation: "#4CAF50", // Green
  Meeting: "#2196F3", // Blue
  "Case Hearing": "#FF9800", // Orange
  Filing: "#9C27B0", // Purple
  "Follow-up": "#FFC107", // Yellow
  Other: "#607D8B", // Gray
};

const EventEditForm = ({ isOpen, onClose, onSubmit, eventData, events }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(eventTypes[0]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lawyerId, setLawyerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({
    title: false,
    type: false,
    location: false,
    startTime: false,
    endTime: false,
    lawyerId: false,
    clientId: false,
  });
  const [touched, setTouched] = useState({
    title: false,
    type: false,
    location: false,
    startTime: false,
    endTime: false,
    lawyerId: false,
    clientId: false,
  });

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let hasError = false;
    if (field === "title" || field === "type" || field === "location") {
      hasError = !value || value.trim() === "";
    } else if (
      field === "startTime" ||
      field === "endTime" ||
      field === "lawyerId" ||
      field === "clientId"
    ) {
      hasError = !value;
    }
    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  // Example data for lawyers and clients
  const [lawyers, setLawyers] = useState([]);
  const [clients, setClients] = useState([]);
  const fetchActiveLawyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/lawyers/active-lawyers"
      );
      setLawyers(response.data);
      // console.log(response.data);
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

  useEffect(() => {
    fetchActiveLawyers();
    fetchApprovedClients();

    console.log(events);
  }, []);

  useEffect(() => {
    if (isOpen && eventData) {
      setTitle(eventData.title);
      setType(eventData.extendedProps?.type || eventTypes[0]);
      setLocation(eventData.extendedProps?.location || "");
      setNotes(eventData.extendedProps?.notes || "");
      setStartTime(eventData.extendedProps?.startTime || "");
      setEndTime(eventData.extendedProps?.endTime || "");
      setLawyerId(eventData?.lawyerId || "");
      setClientId(eventData?.clientId || "");
      setDate(eventData.start.split("T")[0]); // <-- Add this!
    } else {
      setTitle("");
      setType(eventTypes[0]);
      setLocation("");
      setNotes("");
      setStartTime("");
      setEndTime("");
      setLawyerId("");
      setClientId("");
      setDate(""); // <-- Also reset date when closed
    }
  }, [isOpen, eventData]);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setType(eventTypes[0]);
      setLocation("");
      setNotes("");
      setStartTime("");
      setEndTime("");
      setLawyerId("");
      setClientId("");
      setDate("");
      setErrors({
        title: false,
        type: false,
        location: false,
        startTime: false,
        endTime: false,
        lawyerId: false,
        clientId: false,
      });
      setTouched({
        title: false,
        type: false,
        location: false,
        startTime: false,
        endTime: false,
        lawyerId: false,
        clientId: false,
      });
    }
  }, [isOpen]);

  // ✅ REPLACE your hasTimeConflict with this version
  const hasTimeConflict = (start, end) => {
    return events.some((event) => {
      const eventDate = event.start.split("T")[0]; // Only the date part

      if (eventData && event.id === eventData.id) {
        return false; // Skip the event you're currently editing
      }

      if (eventDate !== date) {
        return false; // Skip events from other days
      }

      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      const newStart = new Date(`${date}T${start}`).getTime();
      const newEnd = new Date(`${date}T${end}`).getTime();

      return (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      );
    });
  };

  // ✅ REPLACE your handleSubmit with this updated version
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title.");
    if (!startTime || !endTime)
      return alert("Please select start and end times.");
    if (startTime >= endTime)
      return alert("End time must be after start time.");
    if (!lawyerId) return alert("Please select a lawyer.");
    if (!clientId) return alert("Please select a client.");

    if (hasTimeConflict(startTime, endTime)) {
      alert("The selected time conflicts with an existing appointment.");
      return;
    }

    const color = eventTypeColors[type];

    const data = {
      appointmentId: eventData.id,
      title,
      type,
      location,
      notes,
      startTime,
      endTime,
      lawyerId,
      clientId,
    };
    console.log(data);

    try {
      const response = await axios.patch(
        "http://localhost:3000/api/appointments/update-appointment",
        data
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative space-y-4 border"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        <h3 className="text-lg font-bold">Edit Event</h3>

        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => handleBlur("title", e.target.value)}
            placeholder="Enter title"
            className={`w-full p-2 border rounded ${errors.title && touched.title ? "border-red-500 bg-red-50" : ""}`}
            required
          />
          {errors.title && touched.title && (
            <p className="text-red-500 text-xs mt-1">Title is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type of Event
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            onBlur={(e) => handleBlur("type", e.target.value)}
            className={`w-full p-2 border rounded ${errors.type && touched.type ? "border-red-500 bg-red-50" : ""}`}
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && touched.type && (
            <p className="text-red-500 text-xs mt-1">Type is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assign Lawyer
          </label>
          <select
            value={lawyerId}
            onChange={(e) => setLawyerId(e.target.value)}
            onBlur={(e) => handleBlur("lawyerId", e.target.value)}
            className={`w-full p-2 border rounded ${errors.lawyerId && touched.lawyerId ? "border-red-500 bg-red-50" : ""}`}
            required
          >
            <option value="" disabled>
              Select a lawyer
            </option>
            {lawyers.map((lawyer) => (
              <option key={lawyer.lawyer_id} value={lawyer.lawyer_id}>
                {lawyer.full_name}
              </option>
            ))}
          </select>
          {errors.lawyerId && touched.lawyerId && (
            <p className="text-red-500 text-xs mt-1">Lawyer is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assign Client
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            onBlur={(e) => handleBlur("clientId", e.target.value)}
            className={`w-full p-2 border rounded ${errors.clientId && touched.clientId ? "border-red-500 bg-red-50" : ""}`}
            required
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.full_name}
              </option>
            ))}
          </select>
          {errors.clientId && touched.clientId && (
            <p className="text-red-500 text-xs mt-1">Client is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={(e) => handleBlur("location", e.target.value)}
            placeholder="e.g. RTC Branch 12"
            className={`w-full p-2 border rounded ${touched.location && errors.location ? "border-red-500" : ""
              }`}
          />
          {touched.location && errors.location && (
            <p className="text-red-500 text-sm">Location is required.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details"
            className="w-full p-2 border rounded resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            onBlur={(e) => handleBlur("startTime", e.target.value)}
            className={`w-full p-2 border rounded ${touched.startTime && errors.startTime ? "border-red-500" : ""
              }`}
          />
          {touched.startTime && errors.startTime && (
            <p className="text-red-500 text-sm">Start time is required.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            onBlur={(e) => handleBlur("endTime", e.target.value)}
            className={`w-full p-2 border rounded ${errors.endTime && touched.endTime ? "border-red-500 bg-red-50" : ""}`}
          />
          {errors.endTime && touched.endTime && (
            <p className="text-red-500 text-xs mt-1">End time is required</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#FFB600] text-black py-2 rounded hover:bg-[#e0a800]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EventEditForm;
