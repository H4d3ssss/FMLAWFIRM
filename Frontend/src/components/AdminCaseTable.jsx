import React, { useEffect, useState } from "react";
import { Edit, Eye, Trash2, Search, Archive } from "lucide-react"; // Lucide React icons
import AddCaseModal from "../components/AddCaseModal"; // Import AddCaseModal
import EditCaseModal from "../components/EditCaseModal"; // Import EditCaseModal
import ViewCaseModal from "../components/ViewCaseModal"; // Import ViewCaseModal
import ArchiveCaseModal from "../components/ArchiveCaseModal"; // Import ArchiveCaseModal
import axios from "axios";
const AdminCaseTable = () => {
  const [cases, setCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCaseNo, setFilterCaseNo] = useState("");
  const [showAddModal, setShowAddModal] = useState(false); // Control AddCaseModal visibility
  const [showEditModal, setShowEditModal] = useState(false); // Control EditCaseModal visibility
  const [showViewModal, setShowViewModal] = useState(false); // Control ViewCaseModal visibility
  const [showArchiveModal, setShowArchiveModal] = useState(false); // Control ArchiveCaseModal visibility
  const [currentCase, setCurrentCase] = useState(null); // Store the current case for editing/viewing/archiving
  const [count, setCount] = useState(0);
  const fetchAllCases = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cases");
      setCases(response.data.response);
      console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCases();
    console.log(cases);
  }, [showAddModal, showEditModal, showViewModal, showArchiveModal, count]);

  const handleEditCase = (updatedCase) => {
    const updatedCases = cases.map((caseItem) =>
      caseItem.caseNo === updatedCase.caseNo ? updatedCase : caseItem
    );
    setCases(updatedCases); // Update the case in the list
  };

  const handleArchiveCase = (archivedCase) => {
    // const remainingCases = cases.filter(
    //   (caseItem) => caseItem.caseNo !== archivedCase.caseNo
    // );
    // setCases(remainingCases); // Remove the archived case from the list
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
    console.log(caseItem);
  };

  // Filtering Cases
  //   const filteredCases = cases.filter((item) => {
  //     const matchesSearch = item.title
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase());
  //     const matchesCaseNo = filterCaseNo ? item.caseNo === filterCaseNo : true;
  //     return matchesSearch && matchesCaseNo;
  //   });

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
            {cases
              ? cases.map((item, index) => (
                  <option key={index} value={item.caseNo}>
                    {item.caseNo}
                  </option>
                ))
              : "No cases"}
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-6 py-2 mt-4 md:mt-0 rounded hover:bg-green-600"
          onClick={() => {
            setShowAddModal(true);
            setCount((prev) => prev + 1);
          }} // Open AddCaseModal
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
            {cases ? (
              cases.map((caseValue, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  <td className="p-3">{caseValue.case_id}</td>
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
                  <td className="p-3 flex space-x-2">
                    <button
                      className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                      onClick={() => handleEditButtonClick(caseValue)} // Pass caseValue to EditCaseModal
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-green-500 hover:bg-green-100 p-2 rounded"
                      onClick={() => handleViewButtonClick(caseValue)} // Open ViewCaseModal
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:bg-red-100 p-2 rounded"
                      onClick={() => handleArchiveButtonClick(caseValue)} // Open ArchiveCaseModal
                    >
                      <Archive size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No case</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* AddCaseModal */}
      <AddCaseModal
        showModal={showAddModal}
        closeModal={() => setShowAddModal(false)} // Close AddCaseModal
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
