import React, { useState, useEffect } from "react";
import { Edit, Archive as ArchiveIcon, Search, Plus } from "lucide-react";
import AddAdminModal from "./AddAdminModal";
import EditAdminModal from "./EditAdminModal";
import ArchiveAdminModal from "./ArchiveAdminModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminAccountTable = ({ admins }) => {
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

  const [lawyers, setLawyers] = useState([]);
  useEffect(() => {
    const getLawyers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/lawyers");
        setLawyers(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getLawyers();
  });

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for sorting configuration (key and direction)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // State for pagination (current page)
  const [currentPage, setCurrentPage] = useState(1);

  // State for modal visibility
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showArchiveAdminModal, setShowArchiveAdminModal] = useState(false);

  // State for admin data
  const [adminData, setAdminData] = useState(admins);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Number of items to display per page
  const itemsPerPage = 10;

  // Static logic: Handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update search term
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Static logic: Handle sorting logic
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key, // Sort by the selected key (e.g., name, email)
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc", // Toggle direction
    }));
  };

  // Static logic: Sort admins based on the selected key and direction
  const sortedAdmins = [...adminData].sort((a, b) => {
    if (!sortConfig.key) return 0; // If no sort key, return unsorted
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Static logic: Filter admins based on the search term
  const filteredAdmins = sortedAdmins.filter((admin) =>
    `${admin.name} ${admin.email} ${admin.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Static logic: Paginate the filtered admins
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Static logic: Calculate the total number of pages
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  // Static logic: Handle adding a new admin
  const handleAddAdmin = async (newAdmin) => {
    setAdminData((prev) => [...prev, { id: prev.length + 1, ...newAdmin }]);
    console.log(newAdmin);
    try {
      const response = await axios.post("http://localhost:3000/api/lawyers", {
        fullName: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        position: newAdmin.position,
        accountStatus: newAdmin.status,
        confirmPassword: newAdmin.confirmPassword,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Static logic: Handle editing an admin
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin); // Set the admin to be edited
    console.log(admin);
    setShowEditAdminModal(true); // Show the modal
  };

  const handleEditAdmin = (updatedAdmin) => {
    setAdminData((prev) =>
      prev.map((admin) =>
        admin.id === selectedAdmin.id ? { ...admin, ...updatedAdmin } : admin
      )
    );
  };

  // Static logic: Handle archiving an admin
  const handleArchiveClick = (admin) => {
    setSelectedAdmin(admin); // Set the admin to be archived
    setShowArchiveAdminModal(true); // Show the modal
  };

  const handleArchiveAdmin = async (admin) => {
    setAdminData((prev) => prev.filter((a) => a.id !== admin.id)); // Remove admin from the list
    console.log(admin);
    // try {
    //     const response = await axios.patch('http://localhost:3000/api/lawyers/archive-lawyer')
    // } catch (error) {
    //     console.log(error);
    // }
    setShowArchiveAdminModal(false); // Close the modal
  };

  // Dynamic logic: Fetch admin data from the database (commented out for now)
  /*
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await fetch("/api/admins"); // Replace with your API endpoint
                if (response.ok) {
                    const data = await response.json();
                    setAdminData(data); // Set the fetched data to state
                } else {
                    console.error("Failed to fetch admins:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching admins:", error);
            }
        };

        fetchAdmins();
    }, []);
    */

  // Dynamic logic: Add admin to the database (commented out for now)
  /*
    const handleAddAdmin = async (newAdmin) => {
        try {
            const response = await fetch("/api/admins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAdmin),
            });

            if (response.ok) {
                const addedAdmin = await response.json();
                setAdminData((prev) => [...prev, addedAdmin]); // Update state with the new admin
            } else {
                console.error("Failed to add admin:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding admin:", error);
        }
    };
    */

  // Dynamic logic: Edit admin in the database (commented out for now)
  /*
    const handleEditAdmin = async (updatedAdmin) => {
        try {
            const response = await fetch(`/api/admins/${selectedAdmin.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAdmin),
            });

            if (response.ok) {
                const editedAdmin = await response.json();
                setAdminData((prev) =>
                    prev.map((admin) =>
                        admin.id === selectedAdmin.id ? editedAdmin : admin
                    )
                );
            } else {
                console.error("Failed to edit admin:", response.statusText);
            }
        } catch (error) {
            console.error("Error editing admin:", error);
        }
    };
    */

  // Dynamic logic: Archive admin in the database (commented out for now)
  /*
    const handleArchiveAdmin = async (admin) => {
        try {
            const response = await fetch(`/api/admins/${admin.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setAdminData((prev) => prev.filter((a) => a.id !== admin.id)); // Remove admin from state
            } else {
                console.error("Failed to archive admin:", response.statusText);
            }
        } catch (error) {
            console.error("Error archiving admin:", error);
        }
    };
    */

  return (
    <div className="bg-[#FFB600] justify-center mx-60 my-20 rounded-2xl shadow-lg">
      {/* AddAdminModal */}
      <AddAdminModal
        showModal={showAddAdminModal}
        closeModal={() => setShowAddAdminModal(false)}
        handleAddAdmin={handleAddAdmin}
      />

      {/* EditAdminModal */}
      <EditAdminModal
        showModal={showEditAdminModal}
        closeModal={() => setShowEditAdminModal(false)}
        adminDetails={selectedAdmin}
        handleEditAdmin={handleEditAdmin}
      />

      {/* ArchiveAdminModal */}
      <ArchiveAdminModal
        showModal={showArchiveAdminModal}
        closeModal={() => setShowArchiveAdminModal(false)}
        adminData={selectedAdmin}
        handleArchiveAdmin={handleArchiveAdmin}
      />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
        {/* Left Section: Search Bar and Sort Dropdown */}
        <div className="flex items-center space-x-4 w-full md:w-auto p-6">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 pl-10 w-full"
            />
            {/* Search Icon */}
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Search className="w-5 h-5" />
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => handleSort(e.target.value)}
              className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2"
            >
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
              <option value="position">Position</option>
            </select>
          </div>
        </div>

        {/* Right Section: Add New Admin Button */}
        <div className="p-6">
          <button
            onClick={() => setShowAddAdminModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-2xl flex items-center space-x-2 hover:bg-green-600"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Admin</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-b-2xl">
        <table className="table-auto border-collapse w-full rounded-b-2xl">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Admin ID</th> {/* New column for Admin ID */}
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Admin Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email Address{" "}
                {sortConfig.key === "email" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3">Password</th>
              <th className="p-3">Status</th>
              <th className="p-3">Position</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {lawyers.map((lawyer) => (
              <tr
                key={lawyer.lawyer_id}
                className="odd:bg-white even:bg-gray-100"
              >
                <td className="p-3 text-center">{lawyer.lawyer_id}</td>{" "}
                {/* Display Admin ID */}
                <td className="p-3 text-center">
                  {lawyer.user_full_name || lawyer.full_name}
                </td>
                <td className="p-3 text-center">{lawyer.email}</td>
                <td className="p-3 text-center">************</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded ${
                      lawyer.account_status === "Active"
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {lawyer.account_status}
                  </span>
                </td>
                <td className="p-3 text-center">{lawyer.position}</td>
                <td className="p-3 text-center flex justify-center space-x-2">
                  <button onClick={() => handleEditClick(lawyer)}>
                    <Edit className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleArchiveClick(lawyer)}>
                    <ArchiveIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
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

export default AdminAccountTable;
