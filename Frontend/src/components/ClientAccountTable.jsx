import React, { useState, useEffect } from "react";
import { Edit, Archive as ArchiveIcon, Search, Plus } from "lucide-react";
import AddClientAccount from "./AddClientAccount"; // Import AddClientAccount
import EditClientAccount from "./EditClientAccount"; // Import EditClientAccount
import ArchiveClientAccount from "./ArchiveClientAccount"; // Import ArchiveClientAccount
import axios from "axios";
const ClientAccountTable = ({ clients, onEdit, onArchive, lawyerId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false); // State to control AddClientAccount modal
  const [showEditModal, setShowEditModal] = useState(false); // State to control EditClientAccount modal
  const [showArchiveModal, setShowArchiveModal] = useState(false); // State to control ArchiveClientAccount modal
  const [clientData, setClientData] = useState([]); // State to store client data
  const [selectedClient, setSelectedClient] = useState(null); // State to store the selected client for editing/archiving
  const [clients1, setClient1] = useState([]);
  const itemsPerPage = 5;

  const getClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/clients/approved-clients"
      );
      console.log(lawyerId);
      setClient1(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getClients();
  }, []);

  // Fetch clients (static for now, dynamic logic commented out)
  useEffect(() => {
    // Static data for testing
    setClientData(clients);

    // Dynamic logic: Fetch approved clients from the backend (commented out for now)
    /*
        const fetchApprovedClients = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/clients/approved" // Backend endpoint for approved clients
                );
                setClientData(response.data);
            } catch (error) {
                console.error("Error fetching approved clients:", error);
            }
        };

        fetchApprovedClients();
        */
  }, [clients]);

  // Refresh table data
  const refreshTable = () => {
    // Dynamic logic: Fetch updated client data (commented out for now)
    /*
        const fetchUpdatedClients = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/clients/approved" // Backend endpoint for approved clients
                );
                setClientData(response.data);
            } catch (error) {
                console.error("Error refreshing client accounts:", error);
            }
        };

        fetchUpdatedClients();
        */
    console.log("Table refreshed!"); // Placeholder for testing
  };

  // Handle sorting logic
  // const handleSort = (key) => {
  //   setSortConfig((prev) => ({
  //     key,
  //     direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
  //   }));
  // };

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // // Sort clients based on the selected key and direction
  // const sortedClients = [...clientData].sort((a, b) => {
  //   if (!sortConfig.key) return 0;
  //   const aValue = a[sortConfig.key];
  //   const bValue = b[sortConfig.key];
  //   if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
  //   if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
  //   return 0;
  // });

  // // Filter clients based on the search term
  // const filteredClients = sortedClients.filter((client) =>
  //   `${client.id} ${client.name} ${client.email} ${client.phone}`
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase())
  // );

  // Handle edit button click
  const handleEdit = (client) => {
    setSelectedClient(client); // Set the selected client for editing
    setShowEditModal(true); // Open the EditClientAccount modal
  };

  // Handle archive button click
  const handleArchive = (client) => {
    setSelectedClient(client); // Set the selected client for archiving
    setShowArchiveModal(true); // Open the ArchiveClientAccount modal
  };

  // Handle update client
  const handleUpdateClient = (updatedClient) => {
    // Update the client data in the table
    // setClientData((prevData) =>
    //   prevData.map((client) =>
    //     client.id === updatedClient.clientId
    //       ? { ...client, ...updatedClient }
    //       : client
    //   )
    // );
    // console.log("Client updated:", updatedClient); // Log for testing
  };

  // Handle archive client
  const handleArchiveClient = async (archivedClient) => {
    // Remove the archived client from the table
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/clients/archive-client",
        { client_id: archivedClient.client_id, lawyerId }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(archivedClient);
    getClients();

    // setClientData((prevData) =>
    //   prevData.filter((client) => client.id !== archivedClient.id)
    // );
    console.log("Client archived:", archivedClient); // Log for testing
    setShowArchiveModal(false); // Close the ArchiveClientAccount modal
  };
  const [refreshClients, setRefreshClients] = useState(false);

  const toggleRefresh = () => {
    setRefreshClients((prev) => !prev);
  };

  const quickSort = (array, field) => {
    if (array.length <= 1) return array;

    const pivot = array[array.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < array.length - 1; i++) {
      // Compare based on field
      if (
        String(array[i][field]).toLowerCase() <
        String(pivot[field]).toLowerCase()
      ) {
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
    }

    return [...quickSort(left, field), pivot, ...quickSort(right, field)];
  };

  const [sortField, setSortField] = useState("client_id");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = (clients1 || []).filter((item) => {
    const query = searchQuery.toLowerCase();

    if (!query) return true; // If no search, show all

    const fieldValue = item[sortField];
    if (fieldValue === undefined || fieldValue === null) return false;

    return String(fieldValue).toLowerCase().includes(query);
  });
  // Paginate the filtered clients
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // 🛠 Now sort it using quickSort
  const sortedClients = quickSort(filteredClients, sortField);

  return (
    <div className="bg-[#FFB600] justify-center mx-60 my-20 rounded-2xl shadow-lg">
      {/* AddClientAccount Modal */}
      <AddClientAccount
        showModal={showAddModal}
        closeModal={() => setShowAddModal(false)}
        refreshTables={refreshTable}
        adminId={lawyerId}
        getClients={getClients}
      />

      {/* EditClientAccount Modal */}
      <EditClientAccount
        showModal={showEditModal}
        closeModal={() => setShowEditModal(false)}
        clientDetails={selectedClient}
        handleUpdateClient={handleUpdateClient}
        adminId={lawyerId}
        getClients={getClients}
      />

      {/* ArchiveClientAccount Modal */}
      <ArchiveClientAccount
        showModal={showArchiveModal}
        closeModal={() => setShowArchiveModal(false)}
        clientData={selectedClient}
        handleArchiveClient={handleArchiveClient}
        adminId={lawyerId}
        getClients={getClients}
        toggleRefresh={toggleRefresh}
      />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
        {/* Left Section: Search Bar and Sort Dropdown */}
        <div className="flex items-center space-x-4 w-full md:w-auto p-6">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 pl-10 w-full"
            />
            {/* Search Icon */}
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="w-5 h-5" />
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button> // LAGAY TO SA LAHAT
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2"
            >
              <option value="client_id">Sort by Client ID</option>
              <option value="full_name">Sort by Full Name</option>
              <option value="email">Sort by Email</option>
            </select>
          </div>
        </div>

        {/* Right Section: Add New Client Button */}
        <div className="p-6">
          <button
            onClick={() => setShowAddModal(true)} // Open AddClientAccount modal
            className="bg-green-500 text-white px-4 py-2 rounded-2xl flex items-center space-x-2 hover:bg-green-600"
          >
            <Plus className="w-5 h-5" /> {/* Add Icon */}
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-b-2xl">
        <table className="table-auto border-collapse w-full rounded-b-2xl">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="p-3 cursor-pointer"
                // onClick={() => handleSort("id")}
              >
                Client ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 cursor-pointer"
                // onClick={() => handleSort("name")}
              >
                Client Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 cursor-pointer"
                // onClick={() => handleSort("email")}
              >
                Email Address{" "}
                {sortConfig.key === "email" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 cursor-pointer"
                // onClick={() => handleSort("phone")}
              >
                Phone Number{" "}
                {sortConfig.key === "phone" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedClients ? (
              sortedClients.map((client) => (
                <tr key={client.id} className="odd:bg-white even:bg-gray-100">
                  <td className="p-3 text-center">CLI - {client.client_id}</td>
                  <td className="p-3 text-center">
                    {client.first_name} {client.last_name}
                  </td>
                  <td className="p-3 text-center">{client.email}</td>
                  <td className="p-3 text-center">{client.contact_number}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded ${
                        client.account_status === "Approved"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {client.account_status}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center space-x-2">
                    <button onClick={() => handleEdit(client)}>
                      <Edit className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => handleArchive(client)}>
                      <ArchiveIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
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
                  No Clients
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
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClientAccountTable;
