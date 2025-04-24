import React, { useEffect, useState } from "react";
import { Edit, Eye, Search, ArchiveRestore } from "lucide-react"; // Lucide React icons
import EditCaseModal from "../components/EditCaseModal"; // Import EditCaseModal
import ViewCaseModal from "../components/ViewCaseModal"; // Import ViewCaseModal
import RestoreCaseModal from "../components/RestoreCaseModal"; // You'll need to create this
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArchiveCaseTable = () => {
    const [archivedCases, setArchivedCases] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCaseNo, setFilterCaseNo] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [currentCase, setCurrentCase] = useState(null);
    const [count, setCount] = useState(0);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Add sorting states
    const [sortKey, setSortKey] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
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

    useEffect(() => {
        console.log("Fetching archived cases...");
        const fetchArchivedCases = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/cases/archived-cases"
                );
                console.log("Archived cases response:", response.data);
                setArchivedCases(response.data.response || []);
            } catch (error) {
                console.error("Error fetching archived cases:", error);
            }
        };

        fetchArchivedCases();
    }, [showRestoreModal, count]);

    const handleEditButtonClick = (caseItem) => {
        setCurrentCase(caseItem);
        setShowEditModal(true);
    };

    const handleViewButtonClick = (caseItem) => {
        setCurrentCase(caseItem);
        setShowViewModal(true);
    };

    const handleRestoreButtonClick = (caseItem) => {
        setCurrentCase(caseItem);
        setShowRestoreModal(true);
    };

    const handleEditCase = async (updatedCase) => {
        try {
            const response = await axios.patch(
                "http://localhost:3000/api/cases/update-case",
                updatedCase
            );
            console.log("Case updated:", response.data);

            // Update the case in the archivedCases array
            const updatedCases = archivedCases.map((caseItem) =>
                caseItem.case_id === updatedCase.case_id ? updatedCase : caseItem
            );
            setArchivedCases(updatedCases);
        } catch (error) {
            console.log("Error updating case:", error);
        }

        setShowEditModal(false);
    };

    const handleRestoreCase = async () => {
        if (!currentCase) return;

        try {
            const response = await axios.patch(
                "http://localhost:3000/api/cases/restore-case",
                { case_id: currentCase.case_id }
            );
            console.log("Case restored:", response.data);

            // Remove the restored case from the archived list
            setArchivedCases(archivedCases.filter(
                caseItem => caseItem.case_id !== currentCase.case_id
            ));
            setCount(prev => prev + 1);
        } catch (error) {
            console.log("Error restoring case:", error);
        }

        setShowRestoreModal(false);
    };

    // Filter and sort cases
    const filteredAndSortedCases = archivedCases
        .filter((caseItem) => {
            const matchesSearch = caseItem.case_title
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCaseNo = filterCaseNo
                ? caseItem.case_id === parseInt(filterCaseNo)
                : true;
            return matchesSearch && matchesCaseNo;
        })
        .sort((a, b) => {
            if (!sortKey) return 0; // No sorting if sortKey is empty

            let valueA, valueB;

            // Handle special cases for different fields
            if (sortKey === "client") {
                valueA = `${a.client_fname} ${a.client_lname}`.toLowerCase();
                valueB = `${b.client_fname} ${b.client_lname}`.toLowerCase();
            } else if (sortKey === "lawyer") {
                valueA = `${a.lawyer_fname} ${a.lawyer_lname}`.toLowerCase();
                valueB = `${b.lawyer_fname} ${b.lawyer_lname}`.toLowerCase();
            } else {
                valueA = a[sortKey]?.toString().toLowerCase() || "";
                valueB = b[sortKey]?.toString().toLowerCase() || "";
            }

            if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
            if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    // Calculate pagination
    const totalPages = Math.ceil(filteredAndSortedCases.length / ITEMS_PER_PAGE);
    const paginatedCases = filteredAndSortedCases.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            {/* Title - Added to match ArchiveAdminTable */}
            <h2 className="text-xl text-left font-bold p-4">Archived Cases</h2>
            <div className="bg-[#FFB600] justify-center mx-10 my-10 rounded-2xl shadow-lg">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
                    <div className="flex items-center space-x-4 w-full p-6">
                        {/* Search Bar with Icon */}
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search by title..."
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

                        {/* Case Number Filter */}
                        <div className="w-full md:w-64">
                            <select
                                value={filterCaseNo}
                                onChange={(e) => setFilterCaseNo(e.target.value)}
                                className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 w-full"
                            >
                                <option value="">Filter by Case No.</option>
                                {archivedCases.map((item, index) => (
                                    <option key={index} value={item.case_id}>
                                        CASE - {item.case_id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sorting Dropdown */}
                        <div className="w-full md:w-64">
                            <select
                                value={sortKey}
                                onChange={(e) => setSortKey(e.target.value)}
                                className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 w-full"
                            >
                                <option value="">Sort By</option>
                                <option value="case_id">Case No.</option>
                                <option value="case_title">Title</option>
                                <option value="client">Client Name</option>
                                <option value="case_status">Status</option>
                                <option value="lawyer">Lawyer</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-b-2xl">
                    <table className="table-auto border-collapse w-full rounded-b-2xl">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3">Case No.</th>
                                <th className="p-3">Title</th>
                                <th className="p-3">Client</th>
                                <th className="p-3">Time & Date Added</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Last Update</th>
                                <th className="p-3">File</th>
                                <th className="p-3">Lawyer</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCases.length > 0 ? (
                                paginatedCases.map((caseItem, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-100">
                                        <td className="p-3 text-center">CASE - {caseItem.case_id}</td>
                                        <td className="p-3 text-center">{caseItem.case_title}</td>
                                        <td className="p-3 text-center">
                                            {caseItem.client_fname} {caseItem.client_lname}
                                        </td>
                                        <td className="p-3 text-center">
                                            {caseItem.time_only} | {caseItem.date_only}
                                        </td>
                                        <td className="p-3 text-center">{caseItem.case_status}</td>
                                        <td className="p-3 text-center">
                                            {caseItem.last_time_only} | {caseItem.last_date_only}
                                        </td>
                                        <td className="p-3 text-center">
                                            <a
                                                href={`http://localhost:3000/${caseItem.file_path}`}
                                                className="text-blue-500 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {caseItem.file_name}
                                            </a>
                                        </td>
                                        <td className="p-3 text-center">
                                            {caseItem.lawyer_fname} {caseItem.lawyer_lname}
                                        </td>
                                        <td className="p-3 text-center flex justify-center space-x-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => handleEditButtonClick(caseItem)}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => handleViewButtonClick(caseItem)}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="text-amber-500 hover:text-amber-700"
                                                onClick={() => handleRestoreButtonClick(caseItem)}
                                            >
                                                <ArchiveRestore size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center text-gray-500 py-4 bg-white">
                                        No archived cases found
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

            {/* EditCaseModal */}
            <EditCaseModal
                showModal={showEditModal}
                closeModal={() => setShowEditModal(false)}
                handleEditCase={handleEditCase}
                existingCase={currentCase}
            />

            {/* ViewCaseModal */}
            <ViewCaseModal
                showModal={showViewModal}
                closeModal={() => setShowViewModal(false)}
                caseDetails={currentCase}
            />

            {/* RestoreCaseModal */}
            {showRestoreModal && currentCase && (
                <RestoreCaseModal
                    showModal={showRestoreModal}
                    closeModal={() => setShowRestoreModal(false)}
                    caseData={currentCase}
                    handleRestoreCase={handleRestoreCase}
                />
            )}
        </div>
    );
};

export default ArchiveCaseTable;
