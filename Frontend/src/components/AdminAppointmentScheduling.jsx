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
    if (selectedDate) {
      // Fetch available times for the selected date (mocked for now)
      setAvailableTimes(["09:00", "10:00", "11:00", "14:00", "15:00"]);
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const appointmentData = Object.fromEntries(formData.entries());
    // console.log("Admin Appointment Data:", appointmentData);

    const payload = {
      eventTitle: title,
      typeOfEvent: type,
      location,
      notes,
      startTime,
      endTime,
      lawyerId, // Include lawyerId
      clientId, // Include clientId
      appointmentDate: selectedDate,
    };

    console.log(payload);
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

    // if (appointmentData.sendEmail) {
    //   console.log("Notification email will be sent to the client.");
    // }

    alert("Appointment Scheduled by Admin! Check the console for details.");
    onClose(); // Close the modal after submission
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

          {/* Start Time - Added from EventAddForm.jsx */}
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

          {/* End Time - Added from EventAddForm.jsx */}
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
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              required
            />
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAppointmentScheduling;
