import React, { useEffect, useState } from "react";
import { Clock, FileText, Link, X } from "lucide-react"; // Importing Lucide React icons
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
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [party, setParty] = useState(null);
  const [status, setStatus] = useState(null);

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

  const partyOptions = [
    { value: "Plaintiff", label: "Plaintiff" },
    { value: "Defendant", label: "Defendant" },
    { value: "Petitioner", label: "Petitioner" },
    { value: "Respondent", label: "Respondent" },
    {
      value: "Cross-complainant/defendant",
      label: "Cross-complainant/defendant",
    },
    { value: "Complainant", label: "Complainant" },
    { value: "Promisor", label: "Promisor" },
    { value: "Promisee", label: "Promisee" },
    { value: "Beneficiary", label: "Beneficiary" },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("caseId", event.target.caseNo.value);
    formData.append("caseTitle", natureOfCase);
    formData.append("caseDescription", narratives);
    formData.append("caseStatus", status);
    formData.append("party", party); // Use selectedParty state instead
    formData.append("lawyerId", adminId);

    if (useLink) {
      formData.append("file", event.target.link.value);
      formData.append("fileLink", event.target.link.value);
    } else {
      const file = event.target.file.files[0];
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
    console.log(natureOfCase);
    console.log(party);
    console.log(status);
    // return;
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

  const handlePartyChange = (selectedOption) => {
    setSelectedParty(selectedOption);
    setParty(selectedOption ? selectedOption.value : null); // Set natureOfCase
    // Update the selected party
  };

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
    setStatus(selectedOption ? selectedOption.value : null); // Set natureOfCase
  };

  useEffect(() => {
    if (existingCase?.case_title) {
      setNatureOfCase(existingCase.case_title); // Make sure this exactly matches one of the option `value`s
    }
  }, [existingCase]);

  useEffect(() => {
    if (existingCase?.case_status) {
      setStatus(existingCase.case_status); // Make sure this exactly matches one of the option `value`s
    }
  }, [existingCase]);

  useEffect(() => {
    if (existingCase?.party) {
      setParty(existingCase.party); // Make sure this exactly matches one of the option `value`s
    }
  }, [existingCase]);

  // useEffect(() => {
  //   if (existingCase?.case_description && narratives === null) {
  //     setNarratives(existingCase.case_description);
  //   }
  // }, [existingCase, narratives]);

  useEffect(() => {
    if (existingCase?.case_description) {
      setNarratives(existingCase.case_description);
    } else {
      setNarratives(""); // fallback to empty if no description
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
                defaultInputValue={existingCase?.case_title}
                isClearable
                isSearchable
                placeholder="Select Nature of Case"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="client" className="block text-sm font-medium">
                Party of the client
              </label>

              <Select
                name="party"
                options={partyOptions}
                // value={selectedParty}
                value={
                  partyOptions.find((option) => option.value === party) || null
                }
                onChange={handlePartyChange}
                defaultInputValue={existingCase?.party}
                isClearable
                isSearchable
                placeholder="Select Party"
                required
              />
            </div>

            {/* <div className="mb-4">
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
            </div> */}
            {/* <div className="mb-4">
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
            </div> */}
            <label htmlFor="client" className="block text-sm font-medium">
              Case Status
            </label>
            <Select
              name="status"
              options={statusOptions}
              // value={selectedStatus} // Set value to the selected option
              value={
                statusOptions.find((option) => option.value === status) || null
              }
              onChange={handleStatusChange}
              defaultInputValue={existingCase?.case_status}
              isClearable
              isSearchable
              placeholder="Select Status"
              required
            />

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

            {/* <div className="mb-4">
              <label htmlFor="lawyer" className="block text-sm font-medium">
                Lawyer
              </label>
              <input
                type="text"
                id="lawyer"
                name="lawyer"
                value={
                  existingCase?.lawyer_fname + " " + existingCase?.lawyer_lname
                }
                className="border border-gray-300 rounded w-full px-3 py-2"
                disabled
              />
            </div> */}
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
                placeholder="Type your narratives here..."
                className="w-full border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 mb-2"
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
