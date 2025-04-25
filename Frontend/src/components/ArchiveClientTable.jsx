import React, { useEffect, useState } from "react";
import { Search, ArchiveRestore } from "lucide-react";
import RestoreClientModal from "./RestoreClientModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArchiveClientTable = () => {
  const [archivedClients, setArchivedClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [clientToRestore, setClientToRestore] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Add sorting states
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    console.log("ArchiveClientTable mounted");
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );
        if (response.data.role === "Lawyer") {
          // Stay on this page
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

  const getArchivedClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/clients/archived-clients"
      );
      console.log("Archived clients response:", response.data);
      setArchivedClients(response.data);
    } catch (error) {
      console.error("Error fetching archived clients:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching archived clients...");
    getArchivedClients();
  }, [showRestoreModal]); // Refresh when restoration status changes

  const handleRestoreClient = async () => {
    if (!clientToRestore) return;
    console.log(clientToRestore.client_id);
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/clients/restore-client",
        { clientId: clientToRestore.client_id }
      );
      console.log("Client restored:", response.data);

      // Remove the restored client from the archived list
      setArchivedClients(
        archivedClients.filter(
          (client) => client.client_id !== clientToRestore.client_id
        )
      );
    } catch (error) {
      console.log("Error restoring client:", error);
    }
    getArchivedClients();
    setShowRestoreModal(false);
  };

  // Filter and sort clients
  const filteredAndSortedClients = archivedClients
    .filter((client) =>
      `${client.first_name} ${client.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0; // No sorting if sortKey is empty

      let valueA, valueB;

      // Handle special case for full name
      if (sortKey === "full_name") {
        valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
        valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else {
        valueA = a[sortKey]?.toString().toLowerCase() || "";
        valueB = b[sortKey]?.toString().toLowerCase() || "";
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(
    filteredAndSortedClients.length / ITEMS_PER_PAGE
  );
  const paginatedClients = filteredAndSortedClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Title - Added to match ArchiveAdminTable */}
      <h2 className="text-xl text-left font-bold p-4">Archived Clients</h2>
      <div className="bg-[#FFB600] justify-center mx-10 my-10 rounded-2xl shadow-lg">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
          <div className="flex items-center space-x-4 w-full p-6">
            {/* Search Bar with Icon */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 pl-10 w-full"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search className="w-5 h-5" />
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting Dropdown - Placed beside search bar */}
            <div className="w-full md:w-64">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 w-full"
              >
                <option value="">Sort By</option>
                <option value="client_id">Client ID</option>
                <option value="full_name">Name</option>
                <option value="email">Email</option>
                <option value="contact_number">Phone</option>
                <option value="date_of_birth">Birth Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-b-2xl">
          <table className="table-auto border-collapse w-full rounded-b-2xl">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">CLIENT ID</th>
                <th className="p-3">First Name</th>
                <th className="p-3">Last Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Sex</th>
                <th className="p-3">Birth Date</th>
                <th className="p-3">Address</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-100">
                    <td className="p-3 text-center">
                      CLI - {client.client_id}
                    </td>
                    <td className="p-3 text-center">{client.first_name}</td>
                    <td className="p-3 text-center">{client.last_name}</td>
                    <td className="p-3 text-center">{client.email}</td>
                    <td className="p-3 text-center">{client.contact_number}</td>
                    <td className="p-3 text-center">{client.sex}</td>
                    <td className="p-3 text-center">
                      {client.formatted_birthdate}
                    </td>
                    <td className="p-3 text-center">{client.address}</td>
                    <td className="p-3 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setClientToRestore(client);
                          setShowRestoreModal(true);
                        }}
                        className="text-green-500 hover:text-green-700"
                      >
                        <ArchiveRestore className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center text-gray-500 py-4 bg-white"
                  >
                    No archived clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mx-4 pb-1.5 mt-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* RestoreClientModal */}
      {showRestoreModal && clientToRestore && (
        <RestoreClientModal
          showModal={showRestoreModal}
          closeModal={() => setShowRestoreModal(false)}
          clientData={clientToRestore}
          handleRestoreClient={handleRestoreClient}
        />
      )}
    </div>
  );
};

export default ArchiveClientTable;
