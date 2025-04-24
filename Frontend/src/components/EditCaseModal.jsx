import React, { useEffect, useState } from "react";
import { FileText, Link, X } from "lucide-react"; // Importing Lucide React icons
import axios from "axios";
const EditCaseModal = ({
  showModal,
  closeModal,
  handleEditCase,
  existingCase,
  adminId,
  fetchAllCases,
}) => {
  const [useLink, setUseLink] = useState(!existingCase?.fileOrLink?.file); // Determine whether to use link or file based on existing case data
  const [caseToEdit, setCaseToEdit] = useState([]);

  const handleUpdateCase = async (data) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/cases/edit-case",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(adminId);
    const formData = new FormData();

    formData.append("caseId", event.target.caseNo.value);
    formData.append("caseTitle", event.target.title.value);
    formData.append("caseStatus", event.target.status.value);
    formData.append("lawyerId", adminId); // THIS SHOULD BE DYNAMIC LIKE WHOS THE LAWYER THAT IS CURRENTLY LOGGED IN
    if (useLink) {
      formData.append("file", event.target.link.value);
      formData.append("fileLink", event.target.link.value);
    } else {
      const file = event.target.file.files[0];
      // console.log(event.target.file.files[0]);
      if (file) {
        formData.append("file", file);
      }
    }
    // console.log(file);

    // const updatedCase = {
    //   ...existingCase, // Keep the existing case details intact
    //   caseId: event.target.caseNo.value,
    //   caseTitle: event.target.title.value,
    //   caseStatus: event.target.status.value,
    //   lawyerId: 1, // THIS SHOULD BE DYNAMIC LIKE WHOS THE LAWYER THAT IS CURRENTLY LOGGED IN
    //   fileName: useLink
    //     ? event.target.link.value
    //     : event.target.file.files[0]?.name || "", // Safely get file name
    //   filePath: useLink
    //     ? event.target.link.value
    //     : event.target.file.files[0] || null,
    // };

    // console.log(formData);
    handleUpdateCase(formData);
    fetchAllCases();

    // handleEditCase(updatedCase); // Pass the updated case back to parent component
    closeModal(); // Close the modal
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative">
        {/* Modal Header */}
        {/* {console.log(existingCase)} */}
        <div className="bg-blue-400 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Edit Case</h2>
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
              <label htmlFor="caseNo" className="block text-sm font-medium">
                Case Number
              </label>
              <input
                type="text"
                id="caseNo"
                name="caseNo"
                defaultValue={existingCase?.caseNo || existingCase?.case_id} // Pre-fill with caseNo or case_id
                className="border border-gray-300 rounded w-full px-3 py-2"
                required
                disabled
              />
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
                {/* {console.log(existingCase.case_id)} */}
                {/* {console.log(JSON.stringify(existingCase))} */}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={existingCase?.case_title}
                className="border border-gray-300 rounded w-full px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="client" className="block text-sm font-medium">
                Client
              </label>
              <input
                type="text"
                id="client"
                name="client"
                disabled
                defaultValue={
                  existingCase?.client_fname + " " + existingCase?.client_lname
                }
                className="border border-gray-300 rounded w-full px-3 py-2"
                required
              />
            </div>
            <div className="mb-4"></div>
            <div className="mb-4">
              <select
                name="status"
                className="border border-gray-300 rounded w-full px-3 py-2"
                defaultValue={existingCase?.case_status}
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
                  className="cursor-pointer"
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
                  className="cursor-pointer"
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
              {existingCase?.file_name && (
                <p className="text-sm text-gray-600 mt-1">
                  Current file:{" "}
                  <span className="font-medium">{existingCase.file_name}</span>
                </p>
              )}
              {!useLink ? (
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  defaultChecked={existingCase?.file_name}
                />
              ) : (
                <input
                  type="url"
                  id="link"
                  name="link"
                  defaultValue={existingCase?.fileOrLink}
                  placeholder="Enter file link"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="lawyer" className="block text-sm font-medium">
                Lawyer
              </label>
              <input
                type="text"
                id="lawyer"
                name="lawyer"
                defaultValue={
                  existingCase?.lawyer_fname + " " + existingCase?.lawyer_lname
                }
                value={existingCase?.lawyer_id}
                className="border border-gray-300 rounded w-full px-3 py-2"
                disabled
              />
            </div>
            <button
              type="submit"
              className="bg-blue-400 text-black px-4 py-2 rounded hover:bg-blue-600 w-full cursor-pointer"
            >
              Update Case
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCaseModal;
