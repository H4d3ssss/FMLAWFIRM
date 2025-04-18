import React, { useState } from 'react';
import { FileText, Link, X } from 'lucide-react'; // Importing Lucide icons

const AddCaseModal = ({ showModal, closeModal, handleAddCase }) => {
    const [useLink, setUseLink] = useState(false); // Toggle between file upload and link input

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = {
            caseNo: event.target.caseNo.value,
            title: event.target.title.value,
            client: event.target.client.value,
            dateAdded: event.target.dateAdded.value,
            status: event.target.status.value,
            lastUpdate: event.target.lastUpdate.value,
            lawyer: event.target.lawyer.value,
            fileOrLink: useLink
                ? event.target.link.value // Store link if chosen
                : event.target.file.files[0], // Store file if chosen
        };

        handleAddCase(formData); // Pass data to parent component
        closeModal(); // Close the modal
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
                {/* Modal Header */}
                <div className="bg-yellow-400 p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold">Add New Case</h2>
                    <button onClick={closeModal} className="text-black text-xl font-bold">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="caseNo" className="block text-sm font-medium">
                                Case Number
                            </label>
                            <input
                                type="text"
                                id="caseNo"
                                name="caseNo"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="client" className="block text-sm font-medium">
                                Client
                            </label>
                            <input
                                type="text"
                                id="client"
                                name="client"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dateAdded" className="block text-sm font-medium">
                                Date Added
                            </label>
                            <input
                                type="datetime-local"
                                id="dateAdded"
                                name="dateAdded"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-sm font-medium">
                                Status
                            </label>
                            <input
                                type="text"
                                id="status"
                                name="status"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastUpdate" className="block text-sm font-medium">
                                Last Update
                            </label>
                            <input
                                type="datetime-local"
                                id="lastUpdate"
                                name="lastUpdate"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                            />
                        </div>

                        {/* File Upload or Link Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Attach File or Enter Link</label>
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    type="radio"
                                    id="uploadFile"
                                    name="fileOption"
                                    checked={!useLink}
                                    onChange={() => setUseLink(false)}
                                />
                                <label htmlFor="uploadFile" className="flex items-center space-x-2">
                                    <FileText size={18} />
                                    <span>Upload File</span>
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id="useLink"
                                    name="fileOption"
                                    checked={useLink}
                                    onChange={() => setUseLink(true)}
                                />
                                <label htmlFor="useLink" className="flex items-center space-x-2">
                                    <Link size={18} />
                                    <span>Enter Link</span>
                                </label>
                            </div>

                            {!useLink ? (
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            ) : (
                                <input
                                    type="url"
                                    id="link"
                                    name="link"
                                    placeholder="Enter file link"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lawyer" className="block text-sm font-medium">
                                Lawyer
                            </label>
                            <input
                                type="text"
                                id="lawyer"
                                name="lawyer"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                        >
                            Add Case
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCaseModal;
