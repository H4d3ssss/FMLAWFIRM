import React, { useState, useEffect, useRef } from "react";
import { Search, LogOut, Plus, ChevronDown } from "lucide-react";
import { GoLaw } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import AddClientAccount from "./AddClientAccount";
import AddAdminModal from "./AddAdminModal";
import AddCaseModal from "./AddCaseModal";
import AdminAppointmentScheduling from "./AdminAppointmentScheduling";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the appointment modal
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState("");

  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [cases, setCases] = useState([]);

  const getClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/clients/approved-clients"
      );
      setClients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLawyers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/lawyers");
      setLawyers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllCases = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/cases");
      setCases(response.data.response);
      console.log("Cases refreshed successfully");
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  useEffect(() => {
    getClients();
    getLawyers();
    fetchAllCases();
  }, []);

  const MAX_RESULTS = 5;

  const formatDate = () => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  const formatTime = () => {
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date().toLocaleTimeString("en-US", options);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/auth/logout");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log("Logging out...");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleResultClick = (result) => {
    if (result.type === "Client") {
      navigate(`/clients/${result.id}`);
    } else if (result.type === "Case") {
      navigate(`/cases/${result.id}`);
    } else if (result.type === "Lawyer") {
      navigate(`/lawyers/${result.id}`);
    }
  };

  const handleAddAdmin = async (newAdmin) => {
    setAdminData((prev) => [...prev, { id: prev.length + 1, ...newAdmin }]);
    // console.log(newAdmin);
    try {
      // console.log(adminId);
      const response = await axios.post("http://localhost:3000/api/lawyers", {
        // adminId,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        password: newAdmin.password,
        position: newAdmin.position,
        address: newAdmin.address,
        confirmPassword: newAdmin.confirmPassword,
      });
      console.log(response);
      // refreshTable(); // Refresh table after adding
    } catch (error) {
      console.log(error);
    }
  };

  const [sortKey, setSortKey] = useState("name"); // default sort

  const quickSort = (arr, key) => {
    if (arr.length <= 1) return arr;

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
      const a = arr[i][key]?.toString().toLowerCase() || "";
      const b = pivot[key]?.toString().toLowerCase() || "";

      if (a < b) left.push(arr[i]);
      else right.push(arr[i]);
    }

    return [...quickSort(left, key), pivot, ...quickSort(right, key)];
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    const normalize = (value) =>
      value?.toString().toLowerCase().replace(/s$/, "") || "";

    const allData = [
      ...clients.map((client) => ({
        type: "Client",
        id: client.client_id,
        name: `${client.first_name} ${client.last_name}`,
        email: client.email,
      })),
      ...cases.map((caseItem) => ({
        type: "Case",
        id: caseItem.case_id,
        name: caseItem.case_title,
        status: caseItem.case_status,
      })),
      ...lawyers.map((lawyer) => ({
        type: "Lawyer",
        id: lawyer.lawyer_id,
        name: `${lawyer.first_name} ${lawyer.last_name}`,
        specialization: lawyer.specialization,
      })),
    ];

    const filteredResults = allData.filter((item) =>
      Object.values(item).some((value) =>
        normalize(value).includes(normalize(query))
      )
    );

    const sortedResults = quickSort(filteredResults, sortKey);
    setSearchResults(sortedResults);
    setShowAllResults(false);
  };

  useEffect(() => {
    if (searchQuery) handleSearch(searchQuery);
  }, [sortKey]);

  return (
    <>
      <nav className="bg-[#ffb600] shadow-md py-3 flex items-center justify-between px-4 md:px-8 lg:px-12 w-full z-50">
        <div className="flex items-center max-w-2xl w-full">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <GoLaw className="size-12" />
            </div>
          </div>

          <div className="w-full mx-4 md:mx-8 flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search clients, cases, title, case ID..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-full max-h-40 overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleResultClick(result)}
                      >
                        {console.log(result)}
                        <p className="text-sm font-medium">{result.name}</p>
                        <p className="text-xs text-gray-500">
                          {result.email ||
                            result.status ||
                            result.specialization}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">
                      No results found.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-green-500 text-white flex items-center px-4 py-2 rounded-md hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-green-500 border border-gray-300 rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Appointment
                  </button>

                  <button
                    onClick={() => {
                      setIsClientModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                  </button>

                  <button
                    onClick={() => {
                      setIsAdminModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Admin
                  </button>

                  <button
                    onClick={() => {
                      setIsCaseModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Case
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 relative">
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-800">{formatDate()}</p>
            <p className="text-sm font-medium text-gray-900">{formatTime()}</p>
          </div>

          {/* Logout Icon */}
          <div className="relative">
            <button
              onClick={handleLogout}
              className="bg-[#ffb600] text-black flex items-center px-4 py-2 rounded-md hover:bg-[#e68900]"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* AdminAppointmentScheduling Modal */}
      <AdminAppointmentScheduling
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <LogoutModal
        showModal={showLogoutModal}
        closeModal={() => setShowLogoutModal(false)}
        handleConfirmLogout={handleConfirmLogout}
      />

      <AddClientAccount
        showModal={isClientModalOpen}
        closeModal={() => setIsClientModalOpen(false)}
        refreshTables={() => {}}
        getNextClientId={() => {}}
        getClients={() => {}}
      />

      <AddAdminModal
        showModal={isAdminModalOpen}
        closeModal={() => setIsAdminModalOpen(false)}
        handleAddAdmin={handleAddAdmin}
        getLawyers={() => {}}
      />

      <AddCaseModal
        showModal={isCaseModalOpen}
        closeModal={() => setIsCaseModalOpen(false)}
        handleAddCase={() => {}}
        count={0}
        setCount={() => {}}
        fetchAllCases={() => {}}
      />
    </>
  );
};

export default Navbar;
