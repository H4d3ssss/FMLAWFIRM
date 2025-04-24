import React, { useState, useEffect } from "react";
import {
  Navbar,
  Footer,
  AdminAccountTable,
  ClientAccountTable,
  AccountApprovalTable,
} from "../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AccountsPage = () => {
  const [activeTab, setActiveTab] = useState("admin"); // Default to admin tab
  const navigate = useNavigate();
  // Mock data for admins

  const [adminId, setAdminId] = useState(null);
  const admins = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      status: "Active",
      position: "Manager",
      password: "password123",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Archived",
      position: "Assistant",
      password: "password456",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      status: "Active",
      position: "Supervisor",
      password: "password789",
    },
  ];

  // Mock data for clients
  const clients = [
    {
      id: 1,
      name: "Client A",
      email: "client.a@example.com",
      phone: "123-456-7890",
      status: "Active",
    },
    {
      id: 2,
      name: "Client B",
      email: "client.b@example.com",
      phone: "987-654-3210",
      status: "Archived",
    },
    {
      id: 3,
      name: "Client C",
      email: "client.c@example.com",
      phone: "555-555-5555",
      status: "Active",
    },
  ];

  // Mock data for approvals
  const approvals = [
    {
      id: 1,
      name: "Jesse Pinkman",
      email: "jesse_pinkman@hotmail.com",
      phone: "5636876338737",
      password: "password123",
    },
    {
      id: 2,
      name: "Walter White",
      email: "walter_white@gmail.com",
      phone: "9876543210",
      password: "password456",
    },
    {
      id: 3,
      name: "Saul Goodman",
      email: "saul_goodman@lawyer.com",
      phone: "5555555555",
      password: "password789",
    },
  ];

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );
        if (response.data.role === "Lawyer") {
          setAdminId(response.data.lawyerId);
          navigate("/accounts");
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

  const handleView = (admin) => {
    console.log("View admin:", admin);
  };

  const handleEdit = (admin) => {
    console.log("Edit admin:", admin);
  };

  const handleArchive = (adminId) => {
    console.log("Archive admin with ID:", adminId);
  };

  const handleEditClient = (client) => {
    console.log("Edit client:", client);
  };

  const handleArchiveClient = (clientId) => {
    console.log("Archive client with ID:", clientId);
  };

  const handleApprove = (approvalId) => {
    console.log("Approved account with ID:", approvalId);
  };

  const handleReject = (approvalId) => {
    console.log("Rejected account with ID:", approvalId);
  };

  return (
    <div className="bg-gradient-to-b from-[#F9C545] to-[#FFFFFF] flex flex-col min-h-screen">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Main content fills remaining space */}
      <div className="flex-grow p-4 container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Account Management
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md inline-flex flex-wrap">
            <button
              className={`px-6 py-3 ${
                activeTab === "admin"
                  ? "bg-[#FFB600] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } ${activeTab === "admin" ? "rounded-l-lg" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              Admin Accounts
            </button>
            <button
              className={`px-6 py-3 ${
                activeTab === "clients"
                  ? "bg-[#FFB600] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("clients")}
            >
              Client Accounts
            </button>
            <button
              className={`px-6 py-3 ${
                activeTab === "approvals"
                  ? "bg-[#FFB600] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } ${activeTab === "approvals" ? "rounded-r-lg" : ""}`}
              onClick={() => setActiveTab("approvals")}
            >
              Account Approvals
            </button>
          </div>
        </div>

        {/* Conditional Rendering based on active tab */}
        {activeTab === "admin" && (
          <AdminAccountTable
            admins={admins}
            onView={handleView}
            onEdit={handleEdit}
            onArchive={handleArchive}
          />
        )}

        {activeTab === "clients" && (
          <ClientAccountTable
            clients={clients}
            onEdit={handleEditClient}
            onArchive={handleArchiveClient}
            lawyerId={adminId}
          />
        )}

        {activeTab === "approvals" && (
          <AccountApprovalTable
            approvals={approvals}
            onApprove={handleApprove}
            onReject={handleReject}
            lawyerId={adminId}
          />
        )}
      </div>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
};

export default AccountsPage;
