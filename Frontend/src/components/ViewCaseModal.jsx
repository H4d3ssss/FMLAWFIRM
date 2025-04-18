import React from 'react';
import { X } from 'lucide-react'; // Importing Lucide React icons

const ViewCaseModal = ({ showModal, closeModal, caseDetails }) => {
    if (!showModal || !caseDetails) return null; // Do not render the modal if it's not visible or caseDetails is empty

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
                {/* Modal Header */}
                <div className="bg-yellow-400 p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold text-black">View Case</h2>
                    <button onClick={closeModal} className="text-black text-xl font-bold">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm font-medium">Case Number:</p>
                        <p className="text-lg">{caseDetails.caseNo}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium">Title:</p>
                        <p className="text-lg">{caseDetails.title}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium">Client:</p>
                        <p className="text-lg">{caseDetails.client}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium">Time & Date Added:</p>
                        <p className="text-lg">{caseDetails.dateAdded}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium">Status:</p>
                        <p className="text-lg">{caseDetails.status}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium">Last Update:</p>
                        <p className="text-lg">{caseDetails.lastUpdate}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium">File:</p>
                        {caseDetails.file ? (
                            <a
                                href={`files/${caseDetails.file}`}
                                className="text-blue-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {caseDetails.file}
                            </a>
                        ) : (
                            <p className="text-lg">No file uploaded</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium">Lawyer:</p>
                        <p className="text-lg">{caseDetails.lawyer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCaseModal;
