import React, { useEffect, useState } from "react";
import { ArchiveRestore, Search } from "lucide-react"; // Use ArchiveRestore for the restore action
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ArchiveAdminTable = ({ handleRestore }) => {
  // State for search, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState(""); // State for sorting key
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order

  const ITEMS_PER_PAGE = 10; // Number of rows per page

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );

        // console.log(response.data);
        if (response.data.role === "Lawyer") {
          navigate("/archive");
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
  // Mock data for the table
  const staticAdminData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      position: "Manager",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "abcdef",
      position: "Assistant",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "qwerty",
      position: "Supervisor",
    },
    {
      id: 4,
      name: "Bob Brown",
      email: "bob@example.com",
      password: "password",
      position: "Clerk",
    },
    {
      id: 5,
      name: "Charlie White",
      email: "charlie@example.com",
      password: "letmein",
      position: "Admin",
    },
    {
      id: 6,
      name: "Diana Green",
      email: "diana@example.com",
      password: "admin123",
      position: "Manager",
    },
    {
      id: 6,
      name: "Diana Green",
      email: "diana@example.com",
      password: "admin123",
      position: "Manager",
    },
    {
      id: 6,
      name: "Diana Green",
      email: "diana@example.com",
      password: "admin123",
      position: "Manager",
    },
    {
      id: 6,
      name: "Diana Green",
      email: "diana@example.com",
      password: "admin123",
      position: "Manager",
    },
    {
      id: 6,
      name: "Diana Green",
      email: "diana@example.com",
      password: "admin123",
      position: "Manager",
    },
    {
      id: 6,
      name: "Diana Green",
      email: "diana@example.com",
      password: "admin123",
      position: "Manager",
    },
  ];
  const [archivedLawyers, setArchivedLawyers] = useState([]);

  const getArchivedLawyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/lawyers/archived-lawyers"
      );
      setArchivedLawyers(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getArchivedLawyers();
  }, []);

  const handleRestore1 = async (lawyerId) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/lawyers/restore-archived-lawyer",
        { lawyerId }
      );
      getArchivedLawyers();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter and sort data
  const filteredData = staticAdminData
    .filter((admin) =>
      Object.values(admin)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0; // No sorting if sortKey is empty
      const valueA = a[sortKey].toString().toLowerCase();
      const valueB = b[sortKey].toString().toLowerCase();
      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Title - Added to match ArchiveClientTable */}
      <h2 className="text-xl text-left font-bold p-4">Archived Admins</h2>
      <div className="bg-[#FFB600] justify-center mx-10 my-10 rounded-2xl shadow-lg">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
          <div className="flex items-center space-x-4 w-full p-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by name, email, or position..."
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
                </button>
              )}
            </div>

            {/* Sorting Dropdown - Now placed beside search bar */}
            <div className="w-full md:w-64">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 w-full"
              >
                <option value="">Sort By</option>
                <option value="id">Admin ID</option>
                <option value="name">Admin Name</option>
                <option value="email">Email Address</option>
                <option value="position">Position</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-b-2xl">
          <table className="table-auto border-collapse w-full rounded-b-2xl">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Admin ID</th>
                <th className="p-3">Admin Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Position</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {archivedLawyers.length > 0 ? (
                archivedLawyers.map((lawyer, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-100">
                    <td className="p-3 text-center">{lawyer.lawyer_id}</td>
                    <td className="p-3 text-center">
                      {lawyer.first_name} {lawyer.last_name}
                    </td>
                    <td className="p-3 text-center">{lawyer.email}</td>
                    <td className="p-3 text-center">{lawyer.position}</td>
                    <td className="p-3 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => handleRestore1(lawyer.lawyer_id)}
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
                    colSpan="6"
                    className="text-center text-gray-500 py-4 bg-white"
                  >
                    No archived admins.
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
    </div>
  );
};

export default ArchiveAdminTable;
