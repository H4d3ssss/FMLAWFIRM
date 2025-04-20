import React, { useEffect, useState } from "react";
import { FileText, Link, X } from "lucide-react"; // Importing Lucide icons
import axios from "axios";

const AddCaseModal = ({ showModal, closeModal, handleAddCase }) => {
  const [useLink, setUseLink] = useState(false); // Toggle between file upload and link input
  const [approvedClients, setApprovedClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log(event.target.title.value);
    console.log(event.target.status.value);
    console.log(event.target.lawyer.value);
    console.log(event.target.client.value);
    formData.append("caseTitle", event.target.title.value);
    formData.append("clientId", event.target.client.value);
    console.log("im here");
    formData.append("status", event.target.status.value);
    formData.append("lawyerId", event.target.lawyer.value);
    formData.append("file", event.target.file.files[0]); // Important for Multer

    // if (useLink) {
    //   formData.append("link", event.target.link.value);
    // } else {
    //   formData.append("file", event.target.file.files[0]); // Important for Multer
    // }
    console.log(formData);
    addCase(formData); // Pass data to parent component
    closeModal(); // Close the modal
  };

  const addCase = async (formData) => {
    console.log("outside");
    try {
      console.log("is it working");
      const response = await axios.post(
        "http://localhost:3000/api/cases/new-case",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response); // This will log the response when it's successful
    } catch (error) {
      console.log("its not working");
      console.log(error); // This will log the error if something goes wrong
    }
  };

  const getApprovedClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/clients/approved-clients"
      );
      setApprovedClients(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLawyers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/lawyers`);
      setLawyers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApprovedClients();
    getLawyers();
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
        {/* Modal Header */}
        <div className="bg-yellow-400 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Add New Case</h2>
          <button onClick={closeModal} className="text-black text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4"></div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="border border-gray-300 rounded w-full px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="client" className="block text-sm font-medium">
                Client
              </label>
              <select
                name="client"
                className="border border-gray-300 rounded w-full px-3 py-2"
              >
                <option value="" defaultChecked>
                  Client
                </option>
                {approvedClients.map((client, index) => (
                  <option key={index} value={client.client_id}>
                    {client.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <select
                name="status"
                className="border border-gray-300 rounded w-full px-3 py-2"
              >
                <option value="" defaultChecked>
                  Status
                </option>
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
                <option value="Resolved">Resolved</option>
                <option value="On-Hold">On-Hold</option>
                <option value="Dismissed">Dismissed</option>
                <option value="Archived">Archived</option>
                <option value="Under Review">Under Review</option>
                <option value="Awaiting Trial">Awaiting Trial</option>
              </select>
            </div>

            {/* File Upload or Link Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Attach File or Enter Link
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  id="uploadFile"
                  name="fileOption"
                  checked={!useLink}
                  onChange={() => setUseLink(false)}
                />
                <label
                  htmlFor="uploadFile"
                  className="flex items-center space-x-2"
                >
                  <FileText size={18} />
                  <span>Upload File</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="useLink"
                  name="fileOption"
                  checked={useLink}
                  onChange={() => setUseLink(true)}
                />
                <label
                  htmlFor="useLink"
                  className="flex items-center space-x-2"
                >
                  <Link size={18} />
                  <span>Enter Link</span>
                </label>
              </div>

              {!useLink ? (
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              ) : (
                <input
                  type="url"
                  id="link"
                  name="link"
                  placeholder="Enter file link"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="lawyer" className="block text-sm font-medium">
                Lawyer
              </label>
              <select
                name="lawyer"
                className="border border-gray-300 rounded w-full px-3 py-2"
              >
                <option value="" defaultChecked>
                  Lawyer
                </option>
                {lawyers.map((lawyer, index) => (
                  <option key={index} value={lawyer.lawyer_id}>
                    {lawyer.full_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
              Add Case
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCaseModal;
