import React from "react";
import { X } from "lucide-react";

const LogoutModal = ({ showModal, closeModal, handleConfirmLogout }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
                {/* Modal Header */}
                <div className="bg-red-500 p-4 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Confirm Logout</h2>
                    <button onClick={closeModal} className="text-white text-xl font-bold">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-gray-700 text-sm">
                        Are you sure you want to log out? You will need to log in again to access your account.
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
                            onClick={handleConfirmLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;