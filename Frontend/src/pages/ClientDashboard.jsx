import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ActiveCaseCard from "../components/ActiveCaseCard";
import ClientNavbar from "../components/ClientNavbar"; // Import ClientNavbar
import Footer from "../components/Footer"; // Import Footer
import ActivityLog from "../components/ActivityLog"; // Import ActivityLog
import AppointmentView from "../components/AppointmentView"; // Import AppointmentView
import CloseCaseCard from "../components/CloseCaseCard"; // Import CloseCaseCard

const ClientDashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const activities = [
    { title: "Case Updated", description: "Your case was updated by your lawyer.", date: "2023-10-14", time: "2:00 PM" },
    { title: "Appointment Scheduled", description: "You scheduled an appointment.", date: "2023-10-13", time: "10:00 AM" },
    { title: "Document Uploaded", description: "A new document was uploaded to your case.", date: "2023-10-12", time: "4:30 PM" },
  ]; // Example activity data

  const appointment = {
    fullName: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    date: "2023-10-15",
    time: "10:00 AM",
    service: "Consultation",
    notes: "Please bring all necessary documents.",
    location: "123 Main St, Springfield",
  }; // Example appointment data

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
          navigate("/clientdashboard");
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
      <div className="flex flex-1 justify-center items-center">
        <div className="p-6 rounded-lg w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Client Dashboard</h1>
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap justify-center">
            <ActiveCaseCard count={0} />
            <CloseCaseCard count={5} /> {/* Add CloseCaseCard */}
            <AppointmentView appointment={appointment} /> {/* Replace UpcomingAppointmentCard */}
          </div>
          <div className="mt-6">
            <ActivityLog activities={activities} /> {/* Add ActivityLog */}
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default ClientDashboard;
