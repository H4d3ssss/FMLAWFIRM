import React, { use, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const ChangePasswordModal = ({ showModal, closeModal }) => {
  if (!showModal) return null;

  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [currentPasswordMessage, setCurrentPasswordMessage] = useState(
    "Current password is not right"
  );

  const [newPasswordMessage, setNewPasswordMessage] = useState("");

  const handleConfirmChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6 || confirmNewPassword.length < 6) {
      setCurrentPasswordError(false);

      setNewPasswordError(true);
      setNewPasswordMessage("New password has to be 6 characters minimum");
      return console.log("new password has to be 6 characters minimum");
    }

    if (newPassword !== confirmNewPassword) {
      setCurrentPasswordError(false);

      setNewPasswordError(true);
      setNewPasswordMessage("New password does not match");
      return console.log("new password aint match");
    }

    try {
      const response = await axios.post("http://localhost:3000/api/accounts", {
        inputCurrentPassword: currentPassword,
      });
    } catch (error) {
      setNewPasswordError(false);
      setCurrentPasswordMessage("Current password is not right");
    }

    if (currentPassword === newPassword) {
      setCurrentPasswordError(false);

      setNewPasswordError(true);
      setNewPasswordMessage("Old and new password can not be the same");
      return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/accounts/change-password`,
        {
          inputCurrentPassword: currentPassword,
          newPassword,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setCurrentPasswordError(true);
      return;
    }

    console.log("password has been changed");
    closeModal();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-green-500 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Change Password</h2>
          <button onClick={closeModal} className="text-white text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleConfirmChangePassword}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Current password"
                required
              />
              {currentPasswordError && (
                <p className="mt-4 ml-3 text-red-600">
                  {currentPasswordMessage}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="New password"
                required
                min="6"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                type="password"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Confirm new password"
                required
                min="6"
              />
              {newPasswordError && (
                <p className="mt-4 ml-3 text-red-600">{newPasswordMessage}</p>
              )}
            </div>

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
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
