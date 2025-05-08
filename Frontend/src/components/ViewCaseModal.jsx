import React from "react";
import { X } from "lucide-react"; // Importing Lucide React icons

const ViewCaseModal = ({ showModal, closeModal, caseDetails }) => {
  if (!showModal || !caseDetails) return null; // Do not render the modal if it's not visible or caseDetails is empty

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
        {/* Modal Header */}
        <div className="bg-yellow-400 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold text-black">Narratives</h2>
          <button onClick={closeModal} className="text-black text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
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

          {caseDetails.last_date_only && caseDetails.last_time_only && (
            <div className="mb-4">
              <p className="text-sm font-medium">Last Update:</p>
              <p className="text-lg">
                {caseDetails.last_date_only} | {caseDetails.last_time_only}
              </p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm font-medium">Lawyer:</p>
            <p className="text-lg">
              {caseDetails.lawyer_fname} {caseDetails.lawyer_lname}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium">Case Narratives:</p>
            <p className="text-lg">{caseDetails.case_description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCaseModal;
