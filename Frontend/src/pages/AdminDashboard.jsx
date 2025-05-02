import React, { useState, useEffect } from "react";
import {
  Navbar,
  Footer,
  ActiveCaseCard,
  PendingCaseCard,
  UpcomingEventCard,
  TaskDueCard,
  TaskListCard,
  UpcomingEvent,
  AdminActivityLog,
} from "../components";
import AdminApprovalDashboard from "../components/AdminApprovalDashboard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeCases, setActiveCases] = useState([]);
  const [pendingCases, setPendingCases] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [taskDue, setTaskDue] = useState([]);

  //   useEffect(() => {
  //     // Example: Fetch cases, hearings, and tasks
  //     const fetchedActiveCases = [
  //       { id: 1, title: "Case 1", status: "active" },
  //       { id: 2, title: "Case 2", status: "active" },
  //     ];
  //     const fetchedPendingCases = [{ id: 3, title: "Case 3", status: "pending" }];
  //     const fetchedUpcomingEvents = [
  //       { id: 4, title: "Hearing for Case 1", date: "2025-04-20" },
  //     ];
  //     const fetchedTasksDue = [
  //       { id: 5, title: "Submit Financial Report", deadline: "2025-04-18" },
  //       { id: 6, title: "Prepare Case Notes", deadline: "2025-04-19" },
  //     ];

  //     setActiveCases(fetchedActiveCases);
  //     setPendingCases(fetchedPendingCases);
  //     setUpcomingEvents(fetchedUpcomingEvents);
  //     setTasksDue(fetchedTasksDue);
  //   }, []);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );

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

  useEffect(() => {
    const soonestAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments/soonest-appointment"
        );
        setUpcomingEvents(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    soonestAppointments();
  }, []);

  useEffect(() => {
    const getActiveCases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/cases/active"
        );
        setActiveCases(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getActiveCases();
  }, []);

  useEffect(() => {
    const getPendingCases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/cases/pending"
        );
        setPendingCases(response.data.response);
      } catch (error) {
        console.log(error);
      }
    };
    getPendingCases();
  }, []);

  const [logUpdated, setLogUpdated] = useState(false);

  const triggerLogRefresh = () => {
    setLogUpdated((prev) => !prev); // Toggle the boolean to re-trigger useEffect
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
      {/* Navbar */}
      <Navbar className="h-16" />

      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage the law firm's operations
            </p>
          </header>

          {/* Stats Cards Section */}
          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActiveCaseCard count={activeCases.length} />
              <PendingCaseCard count={pendingCases.length} />
              <UpcomingEventCard
                count={upcomingEvents.length}
                nextEvents={upcomingEvents[0]}
              />
              <TaskDueCard count={taskDue.length} nextTask={taskDue[0]} />
            </div>
          </section>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task List Section - Takes 2/3 of the width on large screens */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Tasks
                </h2>
                <TaskListCard onTaskUpdate={triggerLogRefresh} />
              </div>
            </div>

            {/* Upcoming Events Section - Takes 1/3 of the width on large screens */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Upcoming Events
                </h2>
                <UpcomingEvent />
              </div>
            </div>
          </div>

          {/* Admin Approval Dashboard Section */}
          <section className="mt-10 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Pending Approvals
              </h2>
              <AdminApprovalDashboard />
            </div>
          </section>

          {/* Admin Activity Log */}
          <section className="mt-10 bg-white rounded-lg shadow-md overflow-hidden mb-10">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Recent Activity
              </h2>
              <AdminActivityLog refreshFlag={logUpdated} />
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
