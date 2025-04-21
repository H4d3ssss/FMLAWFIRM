import React, { useEffect, useState } from "react";
import { Edit, Eye, Trash2, Search } from "lucide-react"; // Lucide React icons
import AddClientModal from "./AddClientModal"; // Import AddClientModal
import EditClientModal from "./EditClientModal"; // Import EditClientModal
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AdminClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Control EditClientModal visibility
  const [selectedClient, setSelectedClient] = useState(null); // Store the client being edited

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );

        console.log(response.data);
        if (response.data.role === "Lawyer") {
          navigate("/clients");
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
    const getApprovedClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/clients/approved-clients"
        );
        setClients(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getApprovedClients();
  }, []);

  const getNextClientId = () => {
    return `CLI-${String(101 + clients.length).padStart(3, "0")}`; // Calculate the next client ID
  };

  const handleAddClient = (newClient) => {
    const clientId = getNextClientId(); // Use getNextClientId function
    const clientWithClientId = { ...newClient, clientId }; // Add CLIENT ID to client data
    setClients([...clients, clientWithClientId]);
    console.log(clientWithClientId);
  };

  const handleEditClient = (updatedClient) => {
    // Update the client in the clients array
    const updatedClients = clients.map((client) =>
      client.clientId === updatedClient.clientId ? updatedClient : client
    );
    setClients(updatedClients);
    console.log(updatedClients);
    setShowEditModal(false); // Close the modal after editing
  };

  const handleEditButtonClick = (client) => {
    setSelectedClient(client); // Set the client to be edited
    setShowEditModal(true); // Open the EditClientModal
  };

  const filteredClients = clients.filter((client) =>
    `${client.firstName} ${client.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-transparent justify-center mx-60 my-20 rounded-2xl shadow-lg">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
        <div className="flex items-center space-x-4 w-full md:w-auto p-6">
          {/* Search Bar with Icon */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 pl-10 w-full"
            />
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          </div>
        </div>
        <button
          className="bg-green-500 text-white px-6 py-2 mt-4 md:mt-0 rounded hover:bg-green-600"
          onClick={() => setShowAddModal(true)} // Open AddClientModal
        >
          NEW CLIENT
        </button>
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
            {filteredClients.map((client, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-100">
                <td className="p-3">CLI - {client.client_id}</td>
                <td className="p-3">{client.first_name}</td>
                <td className="p-3">{client.last_name}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.contact_number}</td>
                <td className="p-3">{client.sex}</td>
                <td className="p-3">{client.date_of_birth}</td>
                <td className="p-3">{client.address}</td>
                <td className="p-3 flex space-x-2">
                  <button
                    className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                    onClick={() => handleEditButtonClick(client)} // Open EditClientModal
                  >
                    <Edit size={18} />
                  </button>
                  <button className="text-green-500 hover:bg-green-100 p-2 rounded">
                    <Eye size={18} />
                  </button>
                  <button className="text-red-500 hover:bg-red-100 p-2 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AddClientModal */}
      <AddClientModal
        showModal={showAddModal}
        closeModal={() => setShowAddModal(false)}
        handleAddClient={handleAddClient}
        nextClientId={getNextClientId()}
      />

      {/* EditClientModal */}
      <EditClientModal
        showModal={showEditModal}
        closeModal={() => setShowEditModal(false)}
        clientData={selectedClient} // Pass the selected client to edit
        handleEditClient={handleEditClient} // Pass the edit handler
      />
    </div>
  );
};

export default AdminClientsTable;
