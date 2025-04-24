import React, { useState, useEffect, useRef } from "react";
import { Search, LogOut } from "lucide-react";
import { GoLaw } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import axios from "axios";

const Navbar = ({ clients, cases, lawyers }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSearch = (query) => {
    setSearchQuery(query);

    const allData = [
      ...clients.map((client) => ({
        type: "Client",
        id: client.clientId,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
      })),
      ...cases.map((caseItem) => ({
        type: "Case",
        id: caseItem.caseId,
        name: caseItem.caseTitle,
        status: caseItem.caseStatus,
      })),
      ...lawyers.map((lawyer) => ({
        type: "Lawyer",
        id: lawyer.lawyerId,
        name: `${lawyer.firstName} ${lawyer.lastName}`,
        specialization: lawyer.specialization,
      })),
    ];

    const filteredResults = allData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    setSearchResults(filteredResults);
    setShowAllResults(false);
  };

  const handleResultClick = (result) => {
    if (result.type === "Client") {
      navigate(`/clients/${result.id}`);
    } else if (result.type === "Case") {
      navigate(`/cases/${result.id}`);
    } else if (result.type === "Lawyer") {
      navigate(`/lawyers/${result.id}`);
    }
  };

  return (
    <>
      <nav className="bg-[#ffb600] shadow-md py-3 flex items-center justify-between px-4 md:px-8 lg:px-12 w-full z-50">
        <div className="flex items-center max-w-2xl w-full">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <GoLaw className="size-12" />
            </div>
          </div>

          <div className="w-full mx-4 md:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients, cases, lawyers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {searchQuery && (
              <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-full max-h-40 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults
                      .slice(
                        0,
                        showAllResults ? searchResults.length : MAX_RESULTS
                      )
                      .map((result, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleResultClick(result)}
                        >
                          <p className="text-sm font-medium">
                            {result.name} ({result.type})
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.email ||
                              result.status ||
                              result.specialization}
                          </p>
                        </div>
                      ))}
                    {searchResults.length > MAX_RESULTS && !showAllResults && (
                      <button
                        className="w-full text-center px-4 py-2 text-sm text-blue-500 hover:underline"
                        onClick={() => setShowAllResults(true)}
                      >
                        Show More
                      </button>
                    )}
                    {showAllResults && (
                      <button
                        className="w-full text-center px-4 py-2 text-sm text-blue-500 hover:underline"
                        onClick={() => setShowAllResults(false)}
                      >
                        Show Less
                      </button>
                    )}
                  </>
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">
                    No results found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6 relative">
          <div className="text-right hidden md:block">
            <p className="text-sm text-gray-800">{formatDate()}</p>
            <p className="text-sm font-medium text-gray-900">{formatTime()}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-8 h-8 bg-white rounded-full overflow-hidden cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#ffb600] border border-[#e68900] rounded-lg shadow-lg">
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-[#e68900] rounded-lg"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2 text-black" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal
        showModal={showLogoutModal}
        closeModal={() => setShowLogoutModal(false)}
        handleConfirmLogout={handleConfirmLogout}
      />
    </>
  );
};

export default Navbar;
