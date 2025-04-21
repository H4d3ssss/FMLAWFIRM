import React, { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, Plus } from "lucide-react"; // Icons
// import AddAdminModal from "../components/AddAdminModal"; // Import AddAdminModal "KASI WALA PA"
// import EditAdminModal from "../components/EditAdminModal"; // Import EditAdminModal  "KASI WALA PA "
import axios from "axios";

const AdminAccountTable = () => {
    const [admins, setAdmins] = useState([]); // Admin data
    const [searchQuery, setSearchQuery] = useState(""); // Search input
    const [filterStatus, setFilterStatus] = useState(""); // Filter dropdown
    const [showAddModal, setShowAddModal] = useState(false); // Add modal visibility
    const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
    const [showViewModal, setShowViewModal] = useState(false); // View modal visibility
    const [currentAdmin, setCurrentAdmin] = useState(null); // Selected admin for modals
    const [revealedPasswords, setRevealedPasswords] = useState({}); // Track revealed passwords

    // Fetch admin data
    const fetchAdmins = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/admins");
            setAdmins(response.data.response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, [showAddModal, showEditModal]);

    const handleEditButtonClick = (admin) => {
        setCurrentAdmin(admin);
        setShowEditModal(true);
    };

    const handleDeleteButtonClick = (adminId) => {
        // Add delete logic here
        console.log(`Delete admin with ID: ${adminId}`);
    };

    // Toggle password visibility
    const togglePasswordVisibility = (adminId) => {
        setRevealedPasswords((prev) => ({
            ...prev,
            [adminId]: !prev[adminId], // Toggle the visibility for the specific admin
        }));
    };

    // Filtered admins based on search and filter
    const filteredAdmins = admins.filter((admin) => {
        const matchesSearch = `${admin.firstName} ${admin.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus ? admin.status === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-transparent justify-center mx-60 my-20 rounded-2xl shadow-lg">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
                <div className="flex items-center space-x-4 w-full md:w-auto p-6">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 pl-10 w-full"
                        />
                        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                    </div>
                    {/* Filter Dropdown */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-gray-300 rounded-2xl px-3 py-2"
                    >
                        <option value="">STATUS</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                {/* Add Admin Button */}
                <button
                    className="bg-green-500 text-white px-6 py-2 mt-4 md:mt-0 rounded hover:bg-green-600 flex items-center space-x-2"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={18} />
                    <span>NEW ADMIN</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-b-2xl">
                <table className="table-auto border-collapse w-full rounded-b-2xl">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">ADMIN NAME</th>
                            <th className="p-3">EMAIL ADDRESS</th>
                            <th className="p-3">PASSWORD</th>
                            <th className="p-3">STATUS</th>
                            <th className="p-3">POSITION</th>
                            <th className="p-3">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.length > 0 ? (
                            filteredAdmins.map((admin, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-100">
                                    <td className="p-3">
                                        {admin.firstName} {admin.lastName}
                                    </td>
                                    <td className="p-3">{admin.email}</td>
                                    <td className="p-3">
                                        {revealedPasswords[admin.id]
                                            ? admin.password
                                            : "************"}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`${admin.status === "Active"
                                                ? "text-green-500"
                                                : "text-red-500"
                                                }`}
                                        >
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{admin.position}</td>
                                    <td className="p-3 flex space-x-2">
                                        <button
                                            className="text-green-500 hover:bg-green-100 p-2 rounded"
                                            onClick={() => togglePasswordVisibility(admin.id)}
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="text-blue-500 hover:bg-blue-100 p-2 rounded"
                                            onClick={() => handleEditButtonClick(admin)}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="text-red-500 hover:bg-red-100 p-2 rounded"
                                            onClick={() => handleDeleteButtonClick(admin.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-3 text-center">
                                    No admins found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* AddAdminModal */}
            <AddAdminModal
                showModal={showAddModal}
                closeModal={() => setShowAddModal(false)}
            />

            {/* EditAdminModal */}
            <EditAdminModal
                showModal={showEditModal}
                closeModal={() => setShowEditModal(false)}
                adminData={currentAdmin}
            />

        </div>
    );
};

export default AdminAccountTable;