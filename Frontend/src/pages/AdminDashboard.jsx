import React, { useState, useEffect } from "react";
import {
  Navbar,
  Sidebar,
  Footer,
  ActiveCaseCard,
  PendingCaseCard,
  UpcomingEventCard,
  TasksDueCard,
  TaskListCard,
  UpcomingEvent,
  AdminActivityLog,
} from "../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const [activeCases, setActiveCases] = useState([]);
  const [pendingCases, setPendingCases] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [tasksDue, setTasksDue] = useState([]);

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
    const getActiveCases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/cases/active"
        );
        console.log(response.data);
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
      <Navbar />

      <div className="flex flex-1">
        <main className="flex p-6 mx-60">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div className="mb-6 grid grid-cols-4 gap-90">
              <ActiveCaseCard count={activeCases.length} />
              <PendingCaseCard count={pendingCases.length} />
              <UpcomingEventCard
                count={upcomingEvents.length}
                nextEvents={upcomingEvents[0]}
              />
              <TasksDueCard count={tasksDue.length} nextTask={tasksDue[0]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-47">
              {/* Task List Card */}
              <div className="col-span-2">
                <TaskListCard />
              </div>
              {/* Upcoming Event Card */}
              <div className="col-span-1">
                <UpcomingEvent />
              </div>
            </div>
            <div className="">
              <div className="">
                <AdminActivityLog />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
