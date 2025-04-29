import React, { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react"; // Lucide React icons
import ViewCaseModal from "../components/ViewCaseModal"; // Import ViewCaseModal
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation

const ClientCaseTable = () => {
    const location = useLocation(); // Get the current location
    const queryParams = new URLSearchParams(location.search); // Parse query parameters
    const caseIdFilter = queryParams.get("caseId"); // Get the caseId from query parameters

    const [cases, setCases] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showViewModal, setShowViewModal] = useState(false); // Control ViewCaseModal visibility
    const [currentCase, setCurrentCase] = useState(null); // Store the current case for viewing

    const fetchClientCases = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/client-cases");
            let casesData = response.data.response;

            // Filter cases if caseIdFilter is present
            if (caseIdFilter) {
                casesData = casesData.filter((caseItem) =>
                    caseItem.case_id.toString() === caseIdFilter
                );
            }

            setCases(casesData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchClientCases();
    }, [caseIdFilter]); // Refetch cases when caseIdFilter changes

    const handleViewButtonClick = (caseItem) => {
        setCurrentCase(caseItem); // Set the current case for viewing
        setShowViewModal(true); // Show the ViewCaseModal
    };

    return (
        <div className="bg-transparent justify-center mx-60 my-20 rounded-2xl shadow-lg">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
                <div className="flex items-center space-x-4 w-full md:w-auto p-6">
                    {/* Search Bar with Icon */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 pl-10 w-full"
                            readOnly // Make the search bar read-only
                        />
                        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
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
                            <th className="p-3">Updated by</th>
                            <th className="p-3">File</th>
                            <th className="p-3">Lawyer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases ? (
                            cases.map((caseValue, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-100 cursor-pointer hover:bg-gray-200" // Add hover effect
                                    onClick={() => handleViewButtonClick(caseValue)} // Make row tappable
                                >
                                    <td className="p-3">CASE - {caseValue.case_id}</td>
                                    <td className="p-3">{caseValue.case_title}</td>
                                    <td className="p-3">
                                        {caseValue.client_fname} {caseValue.client_lname}
                                    </td>
                                    <td className="p-3">
                                        {caseValue.time_only} | {caseValue.date_only}
                                    </td>
                                    <td className="p-3">{caseValue.case_status}</td>
                                    <td className="p-3">
                                        {caseValue.last_time_only} | {caseValue.last_date_only}
                                    </td>
                                    <td className="p-3">
                                        {caseValue.updated_by_fname} {caseValue.updated_by_lname}
                                    </td>
                                    <td className="p-3">
                                        <a
                                            href={`http://localhost:3000/${caseValue.file_path}`} // full backend path
                                            className="text-blue-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {caseValue.file_name}
                                        </a>
                                    </td>
                                    <td className="p-3">
                                        {caseValue.lawyer_fname} {caseValue.lawyer_lname}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="text-center text-gray-500 py-4 bg-white"
                                >
                                    No case
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ViewCaseModal */}
            <ViewCaseModal
                showModal={showViewModal}
                closeModal={() => setShowViewModal(false)} // Close ViewCaseModal
                caseDetails={currentCase} // Pass the selected case to be viewed
            />
        </div>
    );
};

export default ClientCaseTable;
