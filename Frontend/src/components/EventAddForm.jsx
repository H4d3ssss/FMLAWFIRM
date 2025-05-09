import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
const eventTypes = [
  "Consultation",
  "Meeting",
  "Case Hearing",
  "Filing",
  "Follow-up",
];

const eventTypeColors = {
  Consultation: "#4CAF50", // Green
  Meeting: "#2196F3", // Blue
  "Case Hearing": "#FF9800", // Orange
  Filing: "#9C27B0", // Purple
  "Follow-up": "#FFC107", // Yellow
  Other: "#607D8B", // Gray
};

const EventAddForm = ({
  isOpen,
  onClose,
  onSubmit,
  date,
  events,
  adminId,
  setCount,
}) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(eventTypes[0]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [lawyerId, setLawyerId] = useState("");
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState("");

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

  const [lawyers, setLawyers] = useState([]);
  const [clients, setClients] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    setClientId(selectedOption.value);
  };

  const handleLawyerChange = (selectedOption) => {
    setSelectedLawyer(selectedOption);
    setLawyerId(selectedOption.value);
  };

  function transformArray(arr, valueKey, labelKey) {
    return arr.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
  }

  const clientOptions = transformArray(clients, "client_id", "full_name");

  const lawyerOptions = transformArray(lawyers, "lawyer_id", "full_name");

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
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > 2) {
      return alert("Appointment must not exceed 2 hours.");
    }
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
    setCount((prev) => prev + 1);
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
          {/* <select
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
          </select> */}
          <Select
            name="lawyers"
            options={lawyerOptions}
            value={selectedLawyer}
            onChange={handleLawyerChange}
            onBlur={() => handleBlur("lawyerId", lawyerId)}
            isClearable
            isSearchable
            placeholder="Select Lawyer"
          />
          {errors.lawyerId && touched.lawyerId && (
            <p className="text-red-500 text-xs mt-1">Lawyer is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assign Client
          </label>
          <Select
            name="client"
            options={clientOptions}
            value={selectedClient}
            onChange={handleClientChange}
            onBlur={() => handleBlur("clientId", clientId)}
            isClearable
            isSearchable
            placeholder="Select Client"
          />
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
            className={`w-full p-2 border rounded ${errors.location && touched.location ? "border-red-500 bg-red-50" : ""}`}
          />
          {errors.location && touched.location && (
            <p className="text-red-500 text-xs mt-1">Location is required</p>
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
            className={`w-full p-2 border rounded ${errors.startTime && touched.startTime ? "border-red-500 bg-red-50" : ""}`}
            required
            min="08:00"
            max="20:00"
          />
          {errors.startTime && touched.startTime && (
            <p className="text-red-500 text-xs mt-1">Start time is required</p>
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
            required
            min="08:00"
            max="20:00"
          />
          {errors.endTime && touched.endTime && (
            <p className="text-red-500 text-xs mt-1">End time is required</p>
          )}
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
