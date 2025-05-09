import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

const AddAdminModal = ({
  showModal,
  closeModal,
  handleAddAdmin,
  getLawyers,
}) => {
  // Initial form data
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    position: "",
    specialization: "",
  };
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    address: false,
    position: false,
    specialization: false,
  });

  // State for form data
  const [formData, setFormData] = useState(initialFormData);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Static logic for testing
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Static logic: Pass admin data to the parent component
    getLawyers();
    const isContinue = await handleAddAdmin(formData);
    if (!isContinue) {
      console.log("Email already exists");
      setShowError(true);
      return;
    }
    setShowError(false);

    // Close the modal after submission
    closeModal();
  };

  // Dynamic logic for database integration (commented out for now)
  /*
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Example API call to add admin to the database
            const response = await fetch("/api/admins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Admin added successfully:", result);

                // Optionally, update the parent component's state with the new admin
                handleAddAdmin(result);
            } else {
                console.error("Failed to add admin:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding admin:", error);
        }

        // Close the modal after submission
        closeModal();
    };
    */

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-green-400 p-4 rounded-t-lg flex justify-center items-center">
          <h2 className="text-lg font-bold">Add New Admin</h2>
        </div>
        <div className="absolute top-4 right-4">
          <button onClick={closeModal} className="text-black text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium">
                    Admin First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`border rounded w-full px-3 py-2 ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.firstName}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, firstName: false }));
                    }}
                    onBlur={() => {
                      if (formData.firstName.trim() === '') {
                        setErrors((prev) => ({ ...prev, firstName: true }));
                      }
                    }}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">First name is required</p>
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
                    className={`border rounded w-full px-3 py-2 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, email: false }));
                    }}
                    onBlur={() => {
                      if (formData.email.trim() === '') {
                        setErrors((prev) => ({ ...prev, email: true }));
                      }
                    }}
                    required
                  />
                  {showError && (
                    <p className="mt-2 text-red-600">Email already exists</p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`border rounded w-full px-3 py-2 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.password}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, password: false }));
                    }}
                    onBlur={() => {
                      if (formData.password.trim() === '') {
                        setErrors((prev) => ({ ...prev, password: true }));
                      }
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">Password is required</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`border rounded w-full px-3 py-2 ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.address}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, address: false }));
                    }}
                    onBlur={() => {
                      if (formData.address.trim() === '') {
                        setErrors((prev) => ({ ...prev, address: true }));
                      }
                    }}
                    required
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">Address is required</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Admin Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`border rounded w-full px-3 py-2 ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.lastName}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, lastName: false }));
                    }}
                    onBlur={() => {
                      if (formData.lastName.trim() === '') {
                        setErrors((prev) => ({ ...prev, lastName: true }));
                      }
                    }}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">Last name is required</p>
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
                    className={`border rounded w-full px-3 py-2 ${errors.position ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.position}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, position: false }));
                    }}
                    onBlur={() => {
                      if (formData.position.trim() === '') {
                        setErrors((prev) => ({ ...prev, position: true }));
                      }
                    }}
                    required
                  />
                  {errors.position && (
                    <p className="text-red-500 text-xs mt-1">Position is required</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`border rounded w-full px-3 py-2 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, confirmPassword: false }));
                    }}
                    onBlur={() => {
                      if (formData.confirmPassword.trim() === '') {
                        setErrors((prev) => ({ ...prev, confirmPassword: true }));
                      }
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Confirm password is required</p>
                  )}
                </div>

                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium">
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    className={`border rounded w-full px-3 py-2 ${errors.specialization ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    value={formData.specialization}
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, specialization: false }));
                    }}
                    onBlur={() => {
                      if (formData.specialization.trim() === '') {
                        setErrors((prev) => ({ ...prev, specialization: true }));
                      }
                    }}
                    required
                  />
                  {errors.specialization && (
                    <p className="text-red-500 text-xs mt-1">Specialization is required</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mt-8"
            >
              Add Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
