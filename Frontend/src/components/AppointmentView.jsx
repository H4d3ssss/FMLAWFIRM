import React, { useEffect, useState } from "react";
import axios from "axios";
const AppointmentView = () => {
  const [appointment, setAppointment] = useState(null);

  const getAppointment = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/appointments/soonest-appointment-client"
      );
      console.log(response.data[0]);
      setAppointment(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointment();
  }, []);

  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-8 h-full min-h-full flex flex-col justify-center border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#FFB600]">
        Appointment Details
      </h2>
      {appointment ? (
        <div className="space-y-4">
          <p className="text-lg font-medium">
            <strong>Preferred Date: </strong>
            {appointment.formatted_date || "N/A"}
          </p>
          <p className="text-lg font-medium">
            <strong>Preferred Time:</strong>{" "}
            <span className="text-gray-700">
              {appointment.formatted_start_time || "N/A"}
            </span>
          </p>
          <p className="text-lg font-medium">
            <strong>Service Type:</strong>{" "}
            <span className="text-gray-700">
              {appointment.type_of_event || "N/A"}
            </span>
          </p>
          <p className="text-lg font-medium">
            <strong>Additional Notes:</strong>{" "}
            <span className="text-gray-700">{appointment.notes || "N/A"}</span>
          </p>
          <p className="text-lg font-medium">
            <strong>Location:</strong>{" "}
            <span className="text-gray-700">
              {appointment.location || "N/A"}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">No appointment</p>
      )}
    </div>
  );
};

export default AppointmentView;
