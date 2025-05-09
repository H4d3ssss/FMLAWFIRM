import React, { useEffect, useState } from "react";
import { FileText, Link, X } from "lucide-react"; // Importing Lucide React icons
import axios from "axios";
import Select from "react-select";
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
  const [natureOfCase, setNatureOfCase] = useState(null);
  const [narratives, setNarratives] = useState(null);
  const [party, setParty] = useState(null);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({
    natureOfCase: false,
    party: false,
    narratives: false,
    status: false,
    file: false,
    link: false,
  });
  const [touched, setTouched] = useState({
    natureOfCase: false,
    party: false,
    narratives: false,
    status: false,
    file: false,
    link: false,
  });

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let hasError = false;
    if (field === "natureOfCase" || field === "party" || field === "status") {
      hasError = !value;
    } else if (field === "narratives") {
      hasError = !value || value.trim() === "";
    } else if (field === "file" && !useLink) {
      hasError = !value;
    } else if (field === "link" && useLink) {
      hasError = !value || value.trim() === "";
    }

    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  const handleUpdateCase = async (data) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/cases/edit-case",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(adminId);
    const formData = new FormData();

    formData.append("caseId", event.target.caseNo.value);
    formData.append("caseTitle", natureOfCase);
    formData.append("caseDescription", narratives);
    formData.append("caseStatus", status);
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

  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: "Criminal Case", label: "Criminal Case" },
    { value: "Civil Case", label: "Civil Case" },
    { value: "Family Case", label: "Family Case" },
    { value: "Labor Case", label: "Labor Case" },
    { value: "Administrative Case", label: "Administrative Case" },
  ];
  const partyOptions = [
    { value: "Plaintiff", label: "Plaintiff" },
    { value: "Defendant", label: "Defendant" },
    { value: "Witness", label: "Witness" },
    { value: "Other", label: "Other" },
  ];
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "In Progress", label: "In Progress" },
    { value: "Pending", label: "Pending" },
    { value: "Closed", label: "Closed" },
    { value: "Resolved", label: "Resolved" },
    { value: "On-Hold", label: "On-Hold" },
    { value: "Dismissed", label: "Dismissed" },
    { value: "Archived", label: "Archived" },
    { value: "Under Review", label: "Under Review" },
    { value: "Awaiting Trial", label: "Awaiting Trial" },
  ];
  const handleChange = (option) => {
    setSelectedOption(option);
    setNatureOfCase(option ? option.value : null); // Set natureOfCase
    console.log("Selected:", option?.value);
  };

  const handlePartyChange = (option) => {
    setParty(option ? option.value : null); // Set party
    console.log("Selected Party:", option?.value);
  };

  const handleStatusChange = (option) => {
    setStatus(option ? option.value : null); // Set status
    console.log("Selected Status:", option?.value);
  };

  useEffect(() => {
    if (existingCase?.case_title) {
      setNatureOfCase(existingCase.case_title); // Make sure this exactly matches one of the option `value`s
    }
  }, [existingCase]);

  useEffect(() => {
    if (existingCase?.case_description) {
      setNarratives(existingCase.case_description);
    } else {
      setNarratives(""); // fallback to empty if no description
    }
  }, [existingCase]);

  useEffect(() => {
    if (existingCase?.party) {
      setParty(existingCase.party); // Set party from existing case
    }
  }, [existingCase]);

  useEffect(() => {
    if (existingCase?.case_status) {
      setStatus(existingCase.case_status); // Set status from existing case
    }
  }, [existingCase]);

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
                Nature of Case
                {/* {console.log(existingCase.case_id)} */}
                {/* {console.log(JSON.stringify(existingCase))} */}
              </label>
              <Select
                name="natureOfCase"
                options={options}
                value={
                  options.find((option) => option.value === natureOfCase) ||
                  null
                }
                onChange={handleChange}
                onBlur={() => handleBlur("natureOfCase", natureOfCase)}
                defaultInputValue={existingCase?.case_title}
                isClearable
                isSearchable
                placeholder="Select Nature of Case"
                required
              />
              {errors.natureOfCase && touched.natureOfCase && (
                <p className="text-red-500 text-xs mt-1">
                  Nature of case is required
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="party" className="block text-sm font-medium">
                Party
              </label>
              <Select
                name="party"
                options={partyOptions}
                value={
                  partyOptions.find((option) => option.value === party) || null
                }
                onChange={handlePartyChange}
                onBlur={() => handleBlur("party", party)}
                defaultInputValue={existingCase?.party}
                isClearable
                isSearchable
                placeholder="Select Party"
                required
              />
              {errors.party && touched.party && (
                <p className="text-red-500 text-xs mt-1">Party is required</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium">
                Status
              </label>
              <Select
                name="status"
                options={statusOptions}
                value={
                  statusOptions.find((option) => option.value === status) ||
                  null
                }
                onChange={handleStatusChange}
                onBlur={() => handleBlur("status", status)}
                defaultInputValue={existingCase?.case_status}
                isClearable
                isSearchable
                placeholder="Select Status"
                required
              />
              {errors.status && touched.status && (
                <p className="text-red-500 text-xs mt-1">Status is required</p>
              )}
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
                  required
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
                <div>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    className={`border border-gray-300 rounded w-full px-3 py-2 ${errors.file && touched.file ? "border-red-500 bg-red-50" : ""}`}
                    defaultChecked={existingCase?.file_name}
                    required
                    onBlur={(e) => handleBlur("file", e.target.files[0])}
                  />
                  {errors.file && touched.file && (
                    <p className="text-red-500 text-xs mt-1">File is required</p>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    defaultValue={existingCase?.fileOrLink}
                    placeholder="Enter file link"
                    className={`border border-gray-300 rounded w-full px-3 py-2 ${errors.link && touched.link ? "border-red-500 bg-red-50" : ""}`}
                    required
                    onBlur={(e) => handleBlur("link", e.target.value)}
                  />
                  {errors.link && touched.link && (
                    <p className="text-red-500 text-xs mt-1">Link is required</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="bigInput">Narratives:</label>
              <br />
              <textarea
                id="bigInput"
                rows="10"
                cols="50"
                name="narratives"
                value={narratives}
                onChange={(e) => setNarratives(e.target.value)}
                onBlur={() => handleBlur("narratives", narratives)}
                placeholder="Type your narratives here..."
                className={`w-full border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 mb-2 ${errors.narratives && touched.narratives ? "border-red-500 bg-red-50" : ""}`}
                required
              />
              {errors.narratives && touched.narratives && (
                <p className="text-red-500 text-xs mt-1">Narratives are required</p>
              )}
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
