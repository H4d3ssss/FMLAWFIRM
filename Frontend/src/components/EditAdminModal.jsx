import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";

const EditAdminModal = ({ showModal, closeModal, adminDetails, handleEditAdmin }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        status: "",
        position: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Populate form fields with the current admin details when the modal opens
    useEffect(() => {
        if (adminDetails) {
            setFormData({
                name: adminDetails.name || "",
                email: adminDetails.email || "",
                password: "", // Leave password empty for security
                confirmPassword: "", // Leave confirm password empty
                status: adminDetails.status || "Active",
                position: adminDetails.position || "",
            });
        }
    }, [adminDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Static logic: Pass updated admin data to the parent component
        handleEditAdmin(formData);
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
                                    Admin Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.name}
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
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.status}
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