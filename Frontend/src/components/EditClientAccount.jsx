import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
const EditClientAccount = ({
  showModal,
  closeModal,
  clientDetails,
  handleUpdateClient,
}) => {
  const [formData, setFormData] = useState({
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
    // console.log(formData);
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the update handler passed as a prop
    // handleUpdateClient(formData);

    const editClientDetails = async () => {
      try {
        const response = await axios.patch(
          "http://localhost:3000/api/clients/update-client",
          formData
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.last_name}
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

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="contact_number"
                  name="contact_number"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.contact_number}
                  onChange={handleChange}
                  required
                />
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
                  defaultValue=""
                >
                  <option value="" disabled>
                    Status
                  </option>
                  <option value="Approved">Approved</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
