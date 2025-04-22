import React, { useState, useEffect } from "react";
import { Restore, Trash2 } from "lucide-react";

const ArchivedAdminTable = () => {
  const [archivedAdmins, setArchivedAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch archived admins with loading and error handling
  useEffect(() => {
    const fetchArchivedAdmins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admins/archived");
        if (response.ok) {
          const data = await response.json();
          setArchivedAdmins(data);
        } else {
          setError("Failed to fetch archived admins.");
        }
      } catch (error) {
        setError("An error occurred while fetching archived admins.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivedAdmins();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle sorting logic
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Sort archived admins based on the selected key and direction
  const sortedAdmins = [...archivedAdmins].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filter archived admins based on the search term
  const filteredAdmins = sortedAdmins.filter((admin) =>
    `${admin.name} ${admin.email} ${admin.position}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered admins
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Restore an admin
  const handleRestoreAdmin = async (adminId) => {
    try {
      const response = await fetch(`/api/admins/${adminId}/restore`, {
        method: "PUT",
      });

      if (response.ok) {
        setArchivedAdmins((prev) =>
          prev.filter((admin) => admin.id !== adminId)
        );
        console.log("Admin restored successfully");
      } else {
        console.error("Failed to restore admin:", response.statusText);
      }
    } catch (error) {
      console.error("Error restoring admin:", error);
    }
  };

  // Permanently delete an admin
  const handleDeleteAdmin = async (adminId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admin permanently?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArchivedAdmins((prev) =>
          prev.filter((admin) => admin.id !== adminId)
        );
        console.log("Admin deleted successfully");
      } else {
        console.error("Failed to delete admin:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  return (
    <div className="bg-[#FFB600] justify-center mx-60 my-20 rounded-2xl shadow-lg">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
        {/* Left Section: Search Bar */}
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
              🔍
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
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-b-2xl">
        <table className="table-auto border-collapse w-full rounded-b-2xl">
          <thead className="bg-gray-200">
            <tr>
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
              <th className="p-3">Position</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAdmins.map((admin) => (
              <tr key={admin.id} className="odd:bg-white even:bg-gray-100">
                <td className="p-3 text-center">{admin.name}</td>
                <td className="p-3 text-center">{admin.email}</td>
                <td className="p-3 text-center">{admin.position}</td>
                <td className="p-3 text-center flex justify-center space-x-2">
                  <button
                    onClick={() => handleRestoreAdmin(admin.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    <Restore className="w-5 h-5 inline" /> Restore
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    <Trash2 className="w-5 h-5 inline" /> Delete
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

      {/* Loading and Error Messages */}
      {isLoading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
    </div>
  );
};

export default ArchivedAdminTable;
