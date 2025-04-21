import React, { useState, useEffect, useRef } from "react";
import { Search, LogOut } from "lucide-react"; // Import the LogOut icon
import { GoLaw } from "react-icons/go";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Navbar = ({ clients, cases, lawyers }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [showAllResults, setShowAllResults] = useState(false); // State to toggle "Show More"
  const dropdownRef = useRef(null); // Ref to detect clicks outside the dropdown
  const navigate = useNavigate(); // Hook for navigation

  const MAX_RESULTS = 5; // Limit the number of results displayed

  // Format current date
  const formatDate = () => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  // Format current time
  const formatTime = () => {
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date().toLocaleTimeString("en-US", options);
  };

  // Handle Logout
  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here (e.g., clearing tokens, redirecting to login page)
  };

  // Close dropdown when clicking outside
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

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query);

    // Combine all searchable entities
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

    // Filter data based on the query
    const filteredResults = allData.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    setSearchResults(filteredResults);
    setShowAllResults(false); // Reset "Show More" state when a new search is performed
  };

  // Handle Result Click
  const handleResultClick = (result) => {
    if (result.type === "Client") {
      navigate(`/clients/${result.id}`); // Redirect to client details page
    } else if (result.type === "Case") {
      navigate(`/cases/${result.id}`); // Redirect to case details page
    } else if (result.type === "Lawyer") {
      navigate(`/lawyers/${result.id}`); // Redirect to lawyer details page
    }
  };

  return (
    <nav className="bg-[#ffb600] shadow-md py-3 flex items-center justify-between px-18 w-full z-50">
      <div className="flex items-center max-w-2xl w-full">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded flex items-center justify-center">
            <GoLaw className="size-12" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full mx-8">
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

          {/* Search Results */}
          {searchQuery && (
            <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-[575px] max-h-40 overflow-y-auto">
              {searchResults.length > 0 ? (
                <>
                  {searchResults
                    .slice(0, showAllResults ? searchResults.length : MAX_RESULTS)
                    .map((result, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleResultClick(result)} // Redirect on click
                      >
                        <p className="text-sm font-medium">
                          {result.name} ({result.type})
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.email || result.status || result.specialization}
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

      {/* Date/Time and User Profile */}
      <div className="flex items-center space-x-6 relative">
        <div className="text-right">
          <p className="text-sm text-gray-800">{formatDate()}</p>
          <p className="text-sm font-medium text-gray-900">{formatTime()}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-8 h-8 bg-white rounded-full overflow-hidden cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#ffb600] border border-[#e68900] rounded-lg shadow-lg">
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-black hover:bg-[#e68900] rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2 text-black" /> {/* Logout Icon */}
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
