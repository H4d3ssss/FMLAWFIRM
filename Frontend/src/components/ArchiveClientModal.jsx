import React from 'react';
import { X } from 'lucide-react';

const ArchiveClientModal = ({ showModal, closeModal, clientData, handleArchiveClient }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
                {/* Modal Header */}
                <div className="bg-red-500 p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Archive Client</h2>
                    <button onClick={closeModal} className="text-white text-xl font-bold">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Client ID (Read-Only) */}
                            <div>
                                <label htmlFor="clientId" className="block text-sm font-medium">
                                    Client ID
                                </label>
                                <input
                                    type="text"
                                    id="clientId"
                                    name="clientId"
                                    className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                                    value={clientData?.clientId || ''}
                                    readOnly
                                />
                            </div>

                            {/* First Name (Read-Only) */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                                    value={clientData?.firstName || ''}
                                    readOnly
                                />
                            </div>

                            {/* Last Name (Read-Only) */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                                    value={clientData?.lastName || ''}
                                    readOnly
                                />
                            </div>

                            {/* Email (Read-Only) */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                                    value={clientData?.email || ''}
                                    readOnly
                                />
                            </div>

                            {/* Phone (Read-Only) */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                                    value={clientData?.phone || ''}
                                    readOnly
                                />
                            </div>

                            {/* Address (Read-Only) */}
                            <div className="col-span-2">
                                <label htmlFor="fullAddress" className="block text-sm font-medium">
                                    Full Address
                                </label>
                                <textarea
                                    id="fullAddress"
                                    name="fullAddress"
                                    className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                                    value={clientData?.fullAddress || ''}
                                    readOnly
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Confirmation Message */}
                        <p className="text-red-500 text-sm mt-4">
                            Are you sure you want to archive this client? This action cannot be undone.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                                onClick={() => handleArchiveClient(clientData)}
                            >
                                Archive
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArchiveClientModal;