import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
const ArchiveClientAccount = ({
  showModal,
  closeModal,
  clientData,
  handleArchiveClient,
}) => {
  const [password, setPassword] = useState(""); // State for password input
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [clientDetails, setClientDetails] = useState("");

  //   useEffect(() => {
  //     console.log(clientData);
  //     const getSpecificClient = async () => {
  //       try {
  //         const response = await axios.post(
  //           "http://localhost:3000/api/clients/one",
  //           { clientId: clientData.client_id }
  //         );
  //         console.log(response.data.response[0]);
  //         setClientDetails(response.data.response[0]);

  //         console.log(clientDetails);
  //         // setFormData(response.data.response[0]);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getSpecificClient();
  //   }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/clients/archive-client",
        { client_id: clientData.client_id }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  if (!showModal) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-red-500 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">
            Archive Client Account
          </h2>
          <button onClick={closeModal} className="text-white text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
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
                  value={clientData.client_id}
                  readOnly
                />
              </div>

              {/* Client Name (Read-Only) */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium"
                >
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={clientData.full_name}
                  readOnly
                />
              </div>

              {/* Email (Read-Only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={clientData?.email || ""}
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
                  value={clientData?.contact_number || ""}
                  readOnly
                />
              </div>

              {/* Status (Read-Only) */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={clientData?.account_status || ""}
                  readOnly
                />
              </div>

              {/* Password Confirmation */}
            </div>

            {/* Confirmation Message */}
            <p className="text-red-500 text-sm mt-4">
              Are you sure you want to archive this client account? This action
              cannot be undone.
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
                onClick={() => handleArchiveClient({ ...clientData, password })}
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

export default ArchiveClientAccount;
