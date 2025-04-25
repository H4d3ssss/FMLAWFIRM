import React from "react";

const RestoreClientModal = ({
  showModal,
  closeModal,
  clientData,
  handleRestoreClient,
}) => {
  if (!showModal || !clientData) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Restore Client</h2>
        <p className="mb-6">
          Are you sure you want to restore client {clientData.first_name}{" "}
          {clientData.last_name}? This will move them back to the active clients
          list.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleRestoreClient}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Restore Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestoreClientModal;
