import React, { useState } from 'react';
import { Edit, Eye, Trash2, Search, Archive } from 'lucide-react'; // Lucide React icons
import AddCaseModal from '../components/AddCaseModal'; // Import AddCaseModal
import EditCaseModal from '../components/EditCaseModal'; // Import EditCaseModal
import ViewCaseModal from '../components/ViewCaseModal'; // Import ViewCaseModal
import ArchiveCaseModal from '../components/ArchiveCaseModal'; // Import ArchiveCaseModal

const AdminCaseTable = () => {
    const [cases, setCases] = useState([
        {
            caseNo: 'CASE-001',
            title: 'Case of Unauthorized Access: John Doe vs. Global Tech Enterprises',
            client: 'John Doe',
            dateAdded: 'March 11, 2025, 10:30 AM',
            status: 'In progress',
            lastUpdate: 'March 10, 2025, 3:00 PM (Filed initial complaint)',
            file: 'RANDOM.pdf',
            lawyer: 'Atty. Saul Goodman',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCaseNo, setFilterCaseNo] = useState('');
    const [showAddModal, setShowAddModal] = useState(false); // Control AddCaseModal visibility
    const [showEditModal, setShowEditModal] = useState(false); // Control EditCaseModal visibility
    const [showViewModal, setShowViewModal] = useState(false); // Control ViewCaseModal visibility
    const [showArchiveModal, setShowArchiveModal] = useState(false); // Control ArchiveCaseModal visibility
    const [currentCase, setCurrentCase] = useState(null); // Store the current case for editing/viewing/archiving

    const handleAddCase = (newCase) => {
        setCases([...cases, newCase]); // Add new case to the list
    };

    const handleEditCase = (updatedCase) => {
        const updatedCases = cases.map((caseItem) =>
            caseItem.caseNo === updatedCase.caseNo ? updatedCase : caseItem
        );
        setCases(updatedCases); // Update the case in the list
    };

    const handleArchiveCase = (archivedCase) => {
        const remainingCases = cases.filter((caseItem) => caseItem.caseNo !== archivedCase.caseNo);
        setCases(remainingCases); // Remove the archived case from the list
    };

    const handleEditButtonClick = (caseItem) => {
        setCurrentCase(caseItem); // Set the current case for editing
        setShowEditModal(true); // Show the EditCaseModal
    };

    const handleViewButtonClick = (caseItem) => {
        setCurrentCase(caseItem); // Set the current case for viewing
        setShowViewModal(true); // Show the ViewCaseModal
    };

    const handleArchiveButtonClick = (caseItem) => {
        setCurrentCase(caseItem); // Set the current case for archiving
        setShowArchiveModal(true); // Show the ArchiveCaseModal
    };

    // Filtering Cases
    const filteredCases = cases.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCaseNo = filterCaseNo ? item.caseNo === filterCaseNo : true;
        return matchesSearch && matchesCaseNo;
    });

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
                        />
                        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                    </div>
                    <select
                        value={filterCaseNo}
                        onChange={(e) => setFilterCaseNo(e.target.value)}
                        className="bg-white border border-gray-300 rounded-2xl px-3 py-2"
                    >
                        <option value="">Filter by Case No.</option>
                        {cases.map((item, index) => (
                            <option key={index} value={item.caseNo}>
                                {item.caseNo}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="bg-green-500 text-white px-6 py-2 mt-4 md:mt-0 rounded hover:bg-green-600"
                    onClick={() => setShowAddModal(true)} // Open AddCaseModal
                >
                    NEW CASE
                </button>
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
                        {filteredCases.map((item, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-100">
                                <td className="p-3">{item.caseNo}</td>
                                <td className="p-3">{item.title}</td>
                                <td className="p-3">{item.client}</td>
                                <td className="p-3">{item.dateAdded}</td>
                                <td className="p-3">{item.status}</td>
                                <td className="p-3">{item.lastUpdate}</td>
                                <td className="p-3">
                                    <a
                                        href={`files/${item.file}`}
                                        className="text-blue-500 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.file}
                                    </a>
                                </td>
                                <td className="p-3">{item.lawyer}</td>
                                <td className="p-3 flex space-x-2">
                                    <button
                                        className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                                        onClick={() => handleEditButtonClick(item)} // Open EditCaseModal
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        className="text-green-500 hover:bg-green-100 p-2 rounded"
                                        onClick={() => handleViewButtonClick(item)} // Open ViewCaseModal
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="text-red-500 hover:bg-red-100 p-2 rounded"
                                        onClick={() => handleArchiveButtonClick(item)} // Open ArchiveCaseModal
                                    >
                                        <Archive size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* AddCaseModal */}
            <AddCaseModal
                showModal={showAddModal}
                closeModal={() => setShowAddModal(false)} // Close AddCaseModal
                handleAddCase={handleAddCase} // Handle adding a new case
            />

            {/* EditCaseModal */}
            <EditCaseModal
                showModal={showEditModal}
                closeModal={() => setShowEditModal(false)} // Close EditCaseModal
                handleEditCase={handleEditCase} // Handle editing a case
                existingCase={currentCase} // Pass the selected case to be edited
            />

            {/* ViewCaseModal */}
            <ViewCaseModal
                showModal={showViewModal}
                closeModal={() => setShowViewModal(false)} // Close ViewCaseModal
                caseDetails={currentCase} // Pass the selected case to be viewed
            />

            {/* ArchiveCaseModal */}
            <ArchiveCaseModal
                showModal={showArchiveModal}
                closeModal={() => setShowArchiveModal(false)} // Close ArchiveCaseModal
                caseDetails={currentCase} // Pass the selected case to be archived
                handleArchive={handleArchiveCase} // Handle archiving a case
            />
        </div>
    );
};

export default AdminCaseTable;

