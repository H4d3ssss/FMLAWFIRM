import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
const EditAdminModal = ({
  showModal,
  closeModal,
  adminDetails,
  handleEditAdmin,
}) => {
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    accountStatus: "",
    position: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {}, []);

  // Populate form fields with the current admin details when the modal opens
  useEffect(() => {
    console.log(adminDetails);
    if (adminDetails) {
      setFormData({
        userId: adminDetails.user_id,
        firstName: adminDetails.first_name,
        lastName: adminDetails.last_name,
        email: adminDetails.email || "",
        accountStatus: adminDetails.account_status || "Active",
        position: adminDetails.position || "",
      });
    }
  }, [adminDetails]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Static logic: Pass updated admin data to the parent component
    // handleEditAdmin(formData);
    console.log(adminDetails.lawyer_id);
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/lawyers/update-lawyer",
        formData
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    closeModal();

    // Dynamic logic: Update admin in the database (commented out for now)
    /*
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/admins/${adminDetails.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedAdmin = await response.json();
                handleEditAdmin(updatedAdmin); // Update parent state with the updated admin
                closeModal(); // Close the modal
            } else {
                setError("Failed to update admin details.");
            }
        } catch (error) {
            setError("An error occurred while updating admin details.");
        } finally {
            setIsLoading(false);
        }
        */
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-blue-400 p-4 rounded-t-lg flex justify-center items-center">
          <h2 className="text-lg font-bold">Edit Admin</h2>
        </div>
        <div className="absolute top-4 right-4">
          <button onClick={closeModal} className="text-black text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Admin First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Admin Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="accountStatus"
                  name="accountStatus"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.accountStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;
