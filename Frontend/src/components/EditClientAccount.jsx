import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
const EditClientAccount = ({
  showModal,
  closeModal,
  clientDetails,
  handleUpdateClient,
  adminId,
  getClients,
}) => {
  // console.log(adminId);
  const [formData, setFormData] = useState({
    adminId: adminId,
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    status: "",
    client_id: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [clients, setClients] = useState([]);
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    contact_number: false,
    status: false,
  });
  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    contact_number: false,
    status: false,
  });

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let hasError = false;
    if (field === "first_name" || field === "last_name" || field === "status") {
      hasError = !value || value.trim() === "";
    } else if (field === "contact_number") {
      hasError = !value || value.trim() === "";
    }
    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  // Populate form fields with the current client details when the modal opens
  useEffect(() => {
    const getSpecificClient = async () => {
      // console.log(clientDetails);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/clients/one",
          { clientId: clientDetails.client_id }
        );
        // console.log(response.data.response[0]);
        setFormData(response.data.response[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getSpecificClient();

    // if (clientDetails) {
    //   setFormData({
    //     clientId: clientDetails.client_id || "CLI-101", // Static fallback for testing
    //     firstName: clientDetails.first_name || "John Doe", // Static fallback for testing
    //     lastName: clientDetails.last_name || "John Doe", // Static fallback for testing
    //     email: clientDetails.email || "johndoe@example.com", // Static fallback for testing
    //     contactNumber: clientDetails.contact_number || "123-456-7890", // Static fallback for testing
    //     status: clientDetails.account_status || "Active", // Static fallback for testing
    //   });
    // }
  }, [clientDetails]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (adminId) {
      setFormData((prev) => ({ ...prev, adminId }));
    }
    console.log(formData);
  }, [adminId]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the update handler passed as a prop
    // handleUpdateClient(formData);

    const editClientDetails = async () => {
      try {
        const payload = {
          ...formData,
          adminId: adminId, // Include adminId in the actual data body
        };
        const response = await axios.patch(
          "http://localhost:3000/api/clients/update-client",
          payload
        );
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getClients();

    editClientDetails();
    closeModal(); // Close the modal after updating
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-blue-400 p-4 rounded-t-lg flex justify-center items-center">
          <h2 className="text-lg font-bold">Edit Client Account</h2>
        </div>
        <div className="absolute top-4 right-4">
          <button onClick={closeModal} className="text-black text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Client ID */}
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium">
                  Client ID
                </label>
                <input
                  type="text"
                  id="clientId"
                  name="clientId"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={formData.client_id}
                  readOnly
                />
              </div>

              {/* Client Name */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium"
                >
                  Client First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className={`border border-gray-300 rounded w-full px-3 py-2 ${errors.first_name && touched.first_name ? "border-red-500 bg-red-50" : ""}`}
                  value={formData.first_name}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("first_name", e.target.value)}
                  required
                />
                {errors.first_name && touched.first_name && (
                  <p className="text-red-500 text-xs mt-1">First name is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium"
                >
                  Client Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className={`border border-gray-300 rounded w-full px-3 py-2 ${errors.last_name && touched.last_name ? "border-red-500 bg-red-50" : ""}`}
                  value={formData.last_name}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("last_name", e.target.value)}
                  required
                />
                {errors.last_name && touched.last_name && (
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="contact_number"
                  name="contact_number"
                  className={`border border-gray-300 rounded w-full px-3 py-2 ${errors.contact_number && touched.contact_number ? "border-red-500 bg-red-50" : ""}`}
                  value={formData.contact_number}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("contact_number", e.target.value)}
                  required
                />
                {errors.contact_number && touched.contact_number && (
                  <p className="text-red-500 text-xs mt-1">Contact number is required</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className={`border border-gray-300 rounded w-full px-3 py-2 ${errors.status && touched.status ? "border-red-500 bg-red-50" : ""}`}
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("status", e.target.value)}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Status
                  </option>
                  <option value="Approved">Approved</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && touched.status && (
                  <p className="text-red-500 text-xs mt-1">Status is required</p>
                )}
              </div>

              {/* Password */}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClientAccount;
