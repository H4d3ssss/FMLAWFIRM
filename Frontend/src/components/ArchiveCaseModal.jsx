import React, { useEffect } from "react";
import { X, Archive } from "lucide-react"; // Importing Lucide React icons
import axios from "axios";
const ArchiveCaseModal = ({
  showModal,
  closeModal,
  caseDetails,
  handleArchive,
  adminId,
  fetchAllCases,
}) => {
  if (!showModal || !caseDetails) return null; // Do not render the modal if it's not visible or caseDetails is missing

  const archiveCase = async (caseId) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/cases/archived-case",
        { caseId, adminId }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onArchive = () => {
    console.log(caseDetails.case_id);
    archiveCase(caseDetails.case_id);
    fetchAllCases();
    closeModal(); // Close the modal
  };

  useEffect(() => {
    fetchAllCases();
  }, [caseDetails]);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
        {/* Modal Header */}
        <div className="bg-red-500 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Archive Case</h2>
          <button onClick={closeModal} className="text-white text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Are you sure you want to archive the following case?
          </p>
          <div className="mb-4">
            <p className="text-sm font-medium">Case Number:</p>
            <p className="text-lg">{caseDetails.case_id}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium">Title:</p>
            <p className="text-lg">{caseDetails.case_title}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium">Client:</p>
            <p className="text-lg">
              {caseDetails.client_fname} {caseDetails.client_lname}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={closeModal}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onArchive}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2"
            >
              <Archive size={16} />
              <span>Archive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveCaseModal;
