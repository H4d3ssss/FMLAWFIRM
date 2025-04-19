import React, { useState, useEffect } from 'react';
import { FileText, Link, X } from 'lucide-react';

const AddCaseModal = ({ showModal, closeModal, handleAddCase }) => {
    const [useLink, setUseLink] = useState(false);
    const [clients, setClients] = useState([]); // Placeholder for clients
    const [lawyers, setLawyers] = useState([]); // Placeholder for lawyers
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedLawyer, setSelectedLawyer] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(''); // For status dropdown

    // General case statuses
    const caseStatuses = [
        'Open',
        'In Progress',
        'Pending',
        'On Hold',
        'Resolved',
        'Closed',
        'Reopened',
        'Cancelled',
    ];

    // Temporary mock data for clients and lawyers
    useEffect(() => {
        setClients([
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' },
        ]);
        setLawyers([
            { id: '1', name: 'Attorney A' },
            { id: '2', name: 'Attorney B' },
        ]);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = {
            caseNo: event.target.caseNo.value,
            title: event.target.title.value,
            clientId: selectedClient, // Use client ID for database reference
            status: selectedStatus, // Use selected status
            lawyerId: selectedLawyer, // Use lawyer ID for database reference
            fileOrLink: useLink
                ? event.target.link.value
                : event.target.file.files[0], // File or link
            dateAdded: new Date().toISOString(), // Automatically set current date
            lastUpdate: new Date().toISOString(), // Automatically set current date
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
                            <select
                                id="client"
                                name="client"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-sm font-medium">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a status</option>
                                {caseStatuses.map((status, index) => (
                                    <option key={index} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lawyer" className="block text-sm font-medium">
                                Lawyer
                            </label>
                            <select
                                id="lawyer"
                                name="lawyer"
                                className="border border-gray-300 rounded w-full px-3 py-2"
                                value={selectedLawyer}
                                onChange={(e) => setSelectedLawyer(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a lawyer</option>
                                {lawyers.map((lawyer) => (
                                    <option key={lawyer.id} value={lawyer.id}>
                                        {lawyer.name}
                                    </option>
                                ))}
                            </select>
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
