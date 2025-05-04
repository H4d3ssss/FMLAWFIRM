import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppointmentScheduling from "../components/AppointmentScheduling"; // Import the AppointmentScheduling component
import AppointmentView from "../components/AppointmentView"; // Import AppointmentView
import ClientNavbar from "../components/ClientNavbar"; // Import ClientNavbar
import ClientSidebar from "../components/ClientSidebar"; // Import ClientSidebar
import Footer from "../components/Footer"; // Import Footer
import axios from "axios";
const ClientAppointment = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [clientDetails, setClientDetails] = useState("");
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );

        console.log(response.data);
        if (response.data.role === "Lawyer") {
          navigate("/admindashboard");
        } else if (response.data.role === "Client") {
          console.log(response.data);
          setClientDetails(response.data);
          navigate("/client-appointment");
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
        console.log(error);
      }
    };
    authenticateUser();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
      <ClientNavbar /> {/* Add ClientNavbar */}
      <div className="flex flex-1">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4 text-black">
            Schedule an Appointment
          </h1>
          <div className="max-w-6xl mx-auto flex gap-6 items-stretch">
            {" "}
            {/* Add items-stretch */}
            <div className="flex-1 flex flex-col">
              {" "}
              {/* Left side */}
              <div className="flex-1">
                <AppointmentScheduling clientId={clientDetails.clientId} />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {" "}
              {/* Right side */}
              <div className="flex-1">
                <AppointmentView />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default ClientAppointment;
