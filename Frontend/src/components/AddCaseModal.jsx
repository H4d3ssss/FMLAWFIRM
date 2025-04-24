import React, { useEffect, useState } from "react";
import { FileText, Link, X } from "lucide-react";
import axios from "axios";

const AddCaseModal = ({
  showModal,
  closeModal,
  handleAddCase,
  count,
  setCount,
  adminId,
  fetchAllCases,
}) => {
  const [useLink, setUseLink] = useState(false);
  const [approvedClients, setApprovedClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false); // Optional: for UX

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const title = event.target.title.value;
    const clientId = event.target.client.value;
    const status = event.target.status.value;
    const lawyerId = event.target.lawyer.value;

    formData.append("caseTitle", title);
    formData.append("clientId", clientId);
    formData.append("status", status);
    formData.append("lawyerId", lawyerId);
    formData.append("adminId", adminId);

    if (useLink) {
      const link = event.target.link.value;
      formData.append("link", link);
    } else {
      const file = event.target.file.files[0];
      if (file) {
        formData.append("file", file);
      } else {
        alert("Please upload a file.");
        return;
      }
    }
    // console.log(event.target.file.files[0]);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/cases/new-case",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // console.log("Case submitted:", response.data);
      setCount((prev) => prev + 1);
      fetchAllCases();
      closeModal(); // Only close if successful
    } catch (error) {
      console.error("Failed to submit case:", error);
      alert("Something went wrong while submitting the case.");
    } finally {
      setLoading(false);
    }
  };

  const getApprovedClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/clients/approved-clients"
      );
      setApprovedClients(response.data);
    } catch (error) {
      console.error("Failed to fetch approved clients:", error);
    }
  };

  const getLawyers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/lawyers");
      setLawyers(response.data);
    } catch (error) {
      console.error("Failed to fetch lawyers:", error);
    }
  };

  useEffect(() => {
    getApprovedClients();
    getLawyers();
    fetchAllCases();
  }, [count]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
        {/* Modal Header */}
        <div className="bg-green-400 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Add New Case</h2>
          <button
            onClick={closeModal}
            className="text-black text-xl font-bold cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="border border-gray-300 rounded w-full px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="client" className="block text-sm font-medium">
                Client
              </label>
              <select
                name="client"
                required
                className="border border-gray-300 rounded w-full px-3 py-2"
              >
                <option value="">Select a client</option>
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
                required
                className="border border-gray-300 rounded w-full px-3 py-2"
              >
                <option value="">Select status</option>
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
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <FileText size={18} />
                  <span>Upload File</span>
                </label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  id="useLink"
                  name="fileOption"
                  checked={useLink}
                  onChange={() => setUseLink(true)}
                />
                <label
                  htmlFor="useLink"
                  className="flex items-center space-x-2 cursor-pointer"
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
                  required={!useLink}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              ) : (
                <input
                  type="url"
                  id="link"
                  name="link"
                  required={useLink}
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
                required
                className="border border-gray-300 rounded w-full px-3 py-2"
              >
                <option value="">Select a lawyer</option>
                {lawyers.map((lawyer, index) => (
                  <option key={index} value={lawyer.lawyer_id}>
                    {lawyer.full_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-green-400 hover:bg-blue-600"
              } text-black px-4 py-2 rounded w-full cursor-pointer`}
            >
              {loading ? "Submitting..." : "Add Case"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCaseModal;
