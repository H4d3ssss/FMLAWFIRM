import React, { useEffect, useState } from "react";
import { FileText, Link, X } from "lucide-react";
import axios from "axios";
import Select from "react-select";
const AddCaseModal = ({
  showModal,
  closeModal,
  handleAddCase,
  count,
  setCount,
  fetchAllCases,
}) => {
  const [useLink, setUseLink] = useState(false);
  const [approvedClients, setApprovedClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false); // Optional: for UX
  const [natureOfCase, setNatureOfCase] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [narratives, setNarratives] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [linkInput, setLinkInput] = useState("");

  // Initialize errors state for all form fields
  const [errors, setErrors] = useState({
    natureOfCase: false,
    party: false,
    narratives: false,
    client: false,
    status: false,
    lawyer: false,
    file: false,
    link: false,
  });

  // Track which fields have been touched
  const [touched, setTouched] = useState({
    natureOfCase: false,
    party: false,
    narratives: false,
    client: false,
    status: false,
    lawyer: false,
    file: false,
    link: false,
  });

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    setErrors((prev) => ({ ...prev, client: false }));
  };

  const handlePartyChange = (selectedOption) => {
    setSelectedParty(selectedOption);
    setErrors((prev) => ({ ...prev, party: false }));
  };

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
    setErrors((prev) => ({ ...prev, status: false }));
  };

  const handleLawyerChange = (selectedOption) => {
    setSelectedLawyer(selectedOption);
    setErrors((prev) => ({ ...prev, lawyer: false }));
  };

  // Generic onBlur handler for all fields
  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Check if the field is empty or null
    let hasError = false;
    if (field === 'natureOfCase' || field === 'party' || field === 'client' ||
      field === 'status' || field === 'lawyer') {
      hasError = !value;
    } else if (field === 'narratives') {
      hasError = !value || value.trim() === '';
    } else if (field === 'file' && !useLink) {
      hasError = !value;
    } else if (field === 'link' && useLink) {
      hasError = !value || value.trim() === '';
    }

    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  function transformArray(arr, valueKey, labelKey) {
    return arr.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
  }

  const clientOptions = transformArray(
    approvedClients,
    "client_id",
    "full_name"
  );

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

  const lawyerOptions = transformArray(lawyers, "lawyer_id", "full_name");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields before submission
    const newErrors = {
      natureOfCase: !natureOfCase,
      party: !selectedParty,
      narratives: !narratives || narratives.trim() === '',
      client: !selectedClient,
      status: !selectedStatus,
      lawyer: !selectedLawyer,
    };

    if (useLink) {
      newErrors.link = !event.target.link.value;
    } else {
      newErrors.file = !event.target.file.files[0];
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      // Mark all fields as touched to show errors
      setTouched({
        natureOfCase: true,
        party: true,
        narratives: true,
        client: true,
        status: true,
        lawyer: true,
        file: !useLink,
        link: useLink,
      });
      return;
    }

    const formData = new FormData();
    const clientId = event.target.client.value;
    const status = event.target.status.value;
    const lawyerId = event.target.lawyer.value;
    const party = event.target.party.value;

    formData.append("caseTitle", natureOfCase);
    formData.append("clientId", clientId);
    formData.append("caseDescription", narratives);
    formData.append("party", party);
    formData.append("status", status);
    formData.append("lawyerId", lawyerId);

    if (useLink) {
      const link = event.target.link.value;
      formData.append("link", link);
    } else {
      const file = event.target.file.files[0];
      formData.append("file", file);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/cases/new-case",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
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
    setNatureOfCase(option ? option.value : null);
    setErrors((prev) => ({ ...prev, natureOfCase: false }));
  };

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
    setErrors((prev) => ({ ...prev, file: false }));
  };

  const handleLinkChange = (e) => {
    setLinkInput(e.target.value);
    setErrors((prev) => ({ ...prev, link: false }));
  };

  const handleNarrativesChange = (e) => {
    setNarratives(e.target.value);
    setErrors((prev) => ({ ...prev, narratives: false }));
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg relative overflow-y-auto max-h-[90vh]">
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
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Nature of case
                  </label>
                  <Select
                    name="natureOfCase"
                    options={options}
                    value={natureOfCase ? { value: natureOfCase, label: natureOfCase } : null}
                    onChange={handleChange}
                    onBlur={() => handleBlur("natureOfCase", natureOfCase)}
                    className={errors.natureOfCase && touched.natureOfCase ? "border-red-500" : ""}
                    isClearable
                    isSearchable
                    placeholder="Select Nature of Case"
                    required
                  />
                  {errors.natureOfCase && touched.natureOfCase && (
                    <p className="text-red-500 text-xs mt-1">Nature of case is required</p>
                  )}
                </div>

                <div>
                  <label htmlFor="client" className="block text-sm font-medium">
                    Client
                  </label>
                  <Select
                    name="client"
                    options={clientOptions}
                    value={selectedClient}
                    onChange={handleClientChange}
                    onBlur={() => handleBlur("client", selectedClient)}
                    className={errors.client && touched.client ? "border-red-500" : ""}
                    isClearable
                    isSearchable
                    placeholder="Select Client"
                    required
                  />
                  {errors.client && touched.client && (
                    <p className="text-red-500 text-xs mt-1">Client is required</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium">
                    Status
                  </label>
                  <Select
                    name="status"
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    onBlur={() => handleBlur("status", selectedStatus)}
                    className={errors.status && touched.status ? "border-red-500" : ""}
                    isClearable
                    isSearchable
                    placeholder="Select Status"
                    required
                  />
                  {errors.status && touched.status && (
                    <p className="text-red-500 text-xs mt-1">Status is required</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lawyer" className="block text-sm font-medium">
                    Lawyer
                  </label>
                  <Select
                    name="lawyer"
                    options={lawyerOptions}
                    value={selectedLawyer}
                    onChange={handleLawyerChange}
                    onBlur={() => handleBlur("lawyer", selectedLawyer)}
                    className={errors.lawyer && touched.lawyer ? "border-red-500" : ""}
                    isClearable
                    isSearchable
                    placeholder="Select Lawyer"
                    required
                  />
                  {errors.lawyer && touched.lawyer && (
                    <p className="text-red-500 text-xs mt-1">Lawyer is required</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="party" className="block text-sm font-medium">
                    Party of the client
                  </label>
                  <Select
                    name="party"
                    options={partyOptions}
                    value={selectedParty}
                    onChange={handlePartyChange}
                    onBlur={() => handleBlur("party", selectedParty)}
                    className={errors.party && touched.party ? "border-red-500" : ""}
                    isClearable
                    isSearchable
                    placeholder="Select Party"
                    required
                  />
                  {errors.party && touched.party && (
                    <p className="text-red-500 text-xs mt-1">Party is required</p>
                  )}
                </div>

                <div>
                  <label htmlFor="narratives">Narratives:</label>
                  <textarea
                    id="narratives"
                    name="narratives"
                    rows="5"
                    value={narratives}
                    onChange={handleNarrativesChange}
                    onBlur={() => handleBlur("narratives", narratives)}
                    placeholder="Type your narratives here..."
                    className={`w-full border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 mb-1 
                      ${errors.narratives && touched.narratives ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                    required
                  />
                  {errors.narratives && touched.narratives && (
                    <p className="text-red-500 text-xs mt-1">Narratives are required</p>
                  )}
                </div>

                <div>
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
                    <div>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleFileChange}
                        onBlur={() => handleBlur("file", fileInput)}
                        required={!useLink}
                        className={`border rounded w-full px-3 py-2 ${errors.file && touched.file ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
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
                        value={linkInput}
                        onChange={handleLinkChange}
                        onBlur={() => handleBlur("link", linkInput)}
                        required={useLink}
                        placeholder="Enter file link"
                        className={`border rounded w-full px-3 py-2 ${errors.link && touched.link ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                      />
                      {errors.link && touched.link && (
                        <p className="text-red-500 text-xs mt-1">Link is required</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button - Full Width */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 ${loading ? "bg-gray-400" : "bg-green-400 hover:bg-blue-600"} 
                text-black px-4 py-2 rounded w-full cursor-pointer`}
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
