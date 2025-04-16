import React, { useEffect, useState } from "react";
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

const EventAddForm = ({ isOpen, onClose, onSubmit, date, events }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(eventTypes[0]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lawyerId, setLawyerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState("");

  const [lawyers, setLawyers] = useState([]);
  const [clients, setClients] = useState([]);

  const fetchActiveLawyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/lawyers/active-lawyers"
      );
      setLawyers(response.data);
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
    if (isOpen) {
      // Reset form
      setTitle("");
      setType(eventTypes[0]);
      setLocation("");
      setNotes("");
      setStartTime("");
      setEndTime("");
      setLawyerId("");
      setClientId("");
      setError("");
    }
  }, [isOpen]);

  const hasTimeConflict = (start, end) => {
    return events.some((event) => {
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      const newStart = new Date(`${date}T${start}`).getTime();
      const newEnd = new Date(`${date}T${end}`).getTime();

      return (
        (newStart >= eventStart && newStart < eventEnd) || // New start overlaps existing event
        (newEnd > eventStart && newEnd <= eventEnd) || // New end overlaps existing event
        (newStart <= eventStart && newEnd >= eventEnd) // New event fully overlaps existing event
      );
    });
  };

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
      setError("The selected time conflicts with an existing event.");
      return;
    }

    const color = eventTypeColors[type];

    const payload = {
      eventTitle: title,
      typeOfEvent: type,
      location,
      notes,
      startTime,
      endTime,
      lawyerId, // Include lawyerId
      clientId, // Include clientId
      appointmentDate: date,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/appointments`,
        payload
      ); // route dapat to
      console.log(response);
      if (response.data.success) {
        console.log(response.data.message);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
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

        <h3 className="text-lg font-bold">
          New Event on {new Date(date).toDateString()}
        </h3>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type of Event
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assign Lawyer
          </label>
          <select
            value={lawyerId}
            onChange={(e) => setLawyerId(e.target.value)}
            className="w-full p-2 border rounded"
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assign Client
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full p-2 border rounded"
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. RTC Branch 12"
            className="w-full p-2 border rounded"
          />
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
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#FFB600] text-black py-2 rounded hover:bg-[#e0a800]"
        >
          Add Event
        </button>
      </form>
    </div>
  );
};

export default EventAddForm;
