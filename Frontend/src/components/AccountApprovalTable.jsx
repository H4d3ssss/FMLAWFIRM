import React, { useState } from "react";
import { CheckCircle, XCircle, Search } from "lucide-react";

const AccountApprovalTable = () => {
    const [approvals, setApprovals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // State for sorting configuration (key and direction)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // State for pagination (current page)
    const [currentPage, setCurrentPage] = useState(1);

    // Number of items to display per page
    const itemsPerPage = 5;

    // Handle search input changes
    const handleSearch = (e) => {
        setSearchTerm(e.target.value); // Update search term
        setCurrentPage(1); // Reset to the first page when searching
    };

    // Handle sorting logic
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key, // Sort by the selected key (e.g., name, email)
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc", // Toggle direction
        }));
    };

    // Sort approvals based on the selected key and direction
    const sortedApprovals = [...approvals].sort((a, b) => {
        if (!sortConfig.key) return 0; // If no sort key, return unsorted
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Filter approvals based on the search term
    const filteredApprovals = sortedApprovals.filter((approval) =>
        `${approval.name} ${approval.email} ${approval.phone}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Paginate the filtered approvals
    const paginatedApprovals = filteredApprovals.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);

    // Dynamic logic: Fetch pending approvals from the backend (commented out for now)
    /*
    useEffect(() => {
        const fetchPendingApprovals = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/clients/pending" // Backend endpoint for pending approvals
                );
                setApprovals(response.data);
            } catch (error) {
                console.error("Error fetching pending approvals:", error);
            }
        };

        fetchPendingApprovals();
    }, []);
    */

    // Dynamic logic: Approve client registration (commented out for now)
    /*
    const handleApprove = async (clientId) => {
        try {
            await axios.put(
                `http://localhost:3000/api/clients/${clientId}/approve` // Backend endpoint for approval
            );
            setApprovals((prev) => prev.filter((approval) => approval.id !== clientId));
            alert("Client approved successfully!");
        } catch (error) {
            console.error("Error approving client:", error);
        }
    };
    */

    // Dynamic logic: Reject client registration (commented out for now)
    /*
    const handleReject = async (clientId) => {
        try {
            await axios.delete(
                `http://localhost:3000/api/clients/${clientId}/reject` // Backend endpoint for rejection
            );
            setApprovals((prev) => prev.filter((approval) => approval.id !== clientId));
            alert("Client rejected successfully!");
        } catch (error) {
            console.error("Error rejecting client:", error);
        }
    };
    */

    return (
        <div className="bg-[#FFB600] justify-center mx-60 my-20 rounded-2xl shadow-lg">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
                {/* Left Section: Search Bar and Sort Dropdown */}
                <div className="flex items-center space-x-4 w-full md:w-auto p-6">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
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
                            <option value="phone">Phone</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-b-2xl">
                <table className="table-auto border-collapse w-full rounded-b-2xl">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Client Name</th>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Phone Number</th>
                            <th className="p-3">Password</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedApprovals.map((approval) => (
                            <tr key={approval.id} className="odd:bg-white even:bg-gray-100">
                                <td className="p-3 text-center">{approval.name}</td>
                                <td className="p-3 text-center">{approval.email}</td>
                                <td className="p-3 text-center">{approval.phone}</td>
                                <td className="p-3 text-center">************</td>
                                <td className="p-3 text-center text-yellow-500">Waiting for approval</td>
                                <td className="p-3 text-center flex justify-center space-x-2">
                                    <button onClick={() => onApprove(approval.id)}>
                                        <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-700" />
                                    </button>
                                    <button onClick={() => onReject(approval.id)}>
                                        <XCircle className="w-5 h-5 text-red-500 hover:text-red-700" />
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

export default AccountApprovalTable;