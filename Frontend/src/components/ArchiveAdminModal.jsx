import React from "react";
import { X } from "lucide-react";

// Dynamic logic: Archive admin in the database (commented out for now)
/*
const handleArchiveAdmin = async (adminData) => {
    try {
        const response = await fetch(`/api/admins/${adminData.id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log("Admin archived successfully");
            // Optionally, update the parent component's state to remove the admin
        } else {
            console.error("Failed to archive admin:", response.statusText);
        }
    } catch (error) {
        console.error("Error archiving admin:", error);
    }
};
*/

const ArchiveAdminModal = ({
  showModal,
  closeModal,
  adminData,
  handleArchiveAdmin,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-red-500 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Archive Admin</h2>
          <button onClick={closeModal} className="text-white text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form>
            <div className="grid grid-cols-1 gap-6">
              {/* Admin ID (Read-Only) */}
              <div>
                <label htmlFor="adminId" className="block text-sm font-medium">
                  Admin ID
                </label>
                <input
                  type="text"
                  id="adminId"
                  name="adminId"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={adminData?.lawyer_id || ""}
                  readOnly
                />
              </div>

              {/* Admin Name (Read-Only) */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Admin Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={adminData?.user_full_name || ""}
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
                  value={adminData?.email || ""}
                  readOnly
                />
              </div>

              {/* Position (Read-Only) */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={adminData?.position || ""}
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
                  value={adminData?.account_status || ""}
                  readOnly
                />
              </div>
            </div>

            {/* Confirmation Message */}
            <p className="text-red-500 text-sm mt-4">
              Are you sure you want to archive this admin? This action cannot be
              undone.
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
                onClick={() => handleArchiveAdmin(adminData)}
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

export default ArchiveAdminModal;
