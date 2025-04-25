import React, { useState } from "react";
import { Navbar, Footer } from "../components";
import ArchiveClientTable from "../components/ArchiveClientTable";
import ArchiveAdminTable from "../components/ArchiveAdminTable";
import ArchiveCaseTable from "../components/ArchiveCaseTable";

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState("admin"); // Default to clients tab

  return (
    <div className="bg-gradient-to-b from-[#F9C545] to-[#FFFFFF] flex flex-col min-h-screen">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Main content fills remaining space */}
      <div className="flex-grow p-4 container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Archive Management
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
              Archived Admin
            </button>
            <button
              className={`px-6 py-3 ${
                activeTab === "clients"
                  ? "bg-[#FFB600] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } `}
              onClick={() => setActiveTab("clients")}
            >
              Archived Clients
            </button>

            <button
              className={`px-6 py-3 ${
                activeTab === "cases"
                  ? "bg-[#FFB600] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } ${activeTab === "cases" ? "rounded-r-lg" : ""}`}
              onClick={() => setActiveTab("cases")}
            >
              Archived Cases
            </button>
          </div>
        </div>

        {/* Conditional Rendering based on active tab */}
        {activeTab === "admin" && <ArchiveAdminTable />}
        {activeTab === "clients" && <ArchiveClientTable />}
        {activeTab === "cases" && <ArchiveCaseTable />}
      </div>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
};

export default ArchivePage;
