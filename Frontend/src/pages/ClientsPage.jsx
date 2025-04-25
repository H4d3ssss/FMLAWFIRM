import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminClientsTable from "../components/AdminClientsTable";

const ClientsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
      <Navbar />
      <div className="flex-grow">
        <AdminClientsTable />
      </div>
      <Footer />
    </div>
  );
};

export default ClientsPage;
