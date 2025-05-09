import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
const EditAdminModal = ({
  showModal,
  closeModal,
  adminDetails,
  handleEditAdmin,
  lawyerId,
  getLawyers,
}) => {
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    accountStatus: "",
    position: "",
  });

  // Add error and touched states for validation
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    accountStatus: false,
    position: false,
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    accountStatus: false,
    position: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => { }, []);

  // Populate form fields with the current admin details when the modal opens
  useEffect(() => {
    console.log(adminDetails);
    if (adminDetails) {
      setFormData({
        adminId: lawyerId,
        userId: adminDetails.user_id,
        firstName: adminDetails.first_name,
        lastName: adminDetails.last_name,
        email: adminDetails.email || "",
        accountStatus: adminDetails.account_status || "Active",
        position: adminDetails.position || "",
      });

      // Reset errors and touched states when modal opens with new data
      setErrors({
        firstName: false,
        lastName: false,
        email: false,
        accountStatus: false,
        position: false,
      });

      setTouched({
        firstName: false,
        lastName: false,
        email: false,
        accountStatus: false,
        position: false,
      });
    }
  }, [adminDetails]);

  // Generic onBlur handler for all fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let hasError = false;
    const value = formData[field];

    // Field-specific validation
    if (field === 'email') {
      hasError = !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else {
      // General validation for other fields
      hasError = !value || value.trim() === '';
    }

    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  const validate = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      accountStatus: !formData.accountStatus,
      position: !formData.position.trim(),
    };

    setErrors(newErrors);

    // Mark all fields as touched to show all errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      accountStatus: true,
      position: true,
    });

    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    // Static logic: Pass updated admin data to the parent component
    // handleEditAdmin(formData);
    console.log(adminDetails.lawyer_id);
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/lawyers/update-lawyer",
        formData
      );
      console.log(response);
      getLawyers();
      closeModal();
    } catch (error) {
      console.log(error);
      setError("Failed to update admin details.");
    } finally {
      setIsLoading(false);
    }
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
                <label htmlFor="firstName" className="block text-sm font-medium">
                  Admin First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`border rounded w-full px-3 py-2 ${errors.firstName && touched.firstName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                  required
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-xs mt-1">First name is required</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Admin Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`border rounded w-full px-3 py-2 ${errors.lastName && touched.lastName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lastName")}
                  required
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 text-xs mt-1">Last name is required</p>
                )}
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
                  className={`border rounded w-full px-3 py-2 ${errors.email && touched.email ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  required
                  disabled
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {!formData.email.trim() ? "Email is required" : "Invalid email format"}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="accountStatus" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="accountStatus"
                  name="accountStatus"
                  className={`border rounded w-full px-3 py-2 ${errors.accountStatus && touched.accountStatus ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.accountStatus}
                  onChange={handleChange}
                  onBlur={() => handleBlur("accountStatus")}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
                {errors.accountStatus && touched.accountStatus && (
                  <p className="text-red-500 text-xs mt-1">Status is required</p>
                )}
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
                  className={`border rounded w-full px-3 py-2 ${errors.position && touched.position ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.position}
                  onChange={handleChange}
                  onBlur={() => handleBlur("position")}
                  required
                />
                {errors.position && touched.position && (
                  <p className="text-red-500 text-xs mt-1">Position is required</p>
                )}
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
