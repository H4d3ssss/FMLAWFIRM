import React, { useState } from 'react';
import { Edit, Eye, Trash2, Search } from 'lucide-react'; // Lucide React icons
import AddClientModal from './AddClientModal'; // Import AddClientModal

const AdminClientsTable = () => {
    const [clients, setClients] = useState([
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            phone: '+63 999-999-9999',
            sex: 'Male',
            birthDate: '1990-01-01',
            address: '123 Main St, Barangay 1, City A, Province B, Region C, 12345',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false); // Control AddClientModal visibility

    const handleAddClient = (newClient) => {
        console.log('New Client:', newClient); // Debugging
        setClients([...clients, newClient]);
    };

    const handleAddClientData = (formData, fullAddress) => {
        const clientData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            sex: formData.sex,
            birthDate: formData.birthDate,
            address: fullAddress, // Ensure fullAddress is passed here
        };
        handleAddClient(clientData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const regionName = regionsData.find((r) => r.id === locationIds.region)?.name || '';
        const provinceName = provincesData.find((p) => p.id === locationIds.province)?.name || '';
        const cityName = citiesData.find((c) => c.id === locationIds.city)?.name || '';
        const barangayName = barangaysData.find((b) => b.name === formData.barangay)?.name || '';

        const fullAddress = `${formData.houseNumber}, ${formData.streetName}, ${barangayName}, ${cityName}, ${provinceName}, ${regionName}, ${formData.zipCode}`;
        console.log('Full Address:', fullAddress); // Debugging

        const clientData = {
            ...formData,
            fullAddress,
        };

        handleAddClient(clientData);
        closeModal();
    };

    // Filtering Clients
    const filteredClients = clients.filter((client) =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-transparent justify-center mx-60 my-20 rounded-2xl shadow-lg">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFB600] px-6 rounded-t-2xl">
                <div className="flex items-center space-x-4 w-full md:w-auto p-6">
                    {/* Search Bar with Icon */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 bg-white text-black rounded-2xl px-3 py-2 pl-10 w-full"
                        />
                        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                    </div>
                </div>
                <button
                    className="bg-green-500 text-white px-6 py-2 mt-4 md:mt-0 rounded hover:bg-green-600"
                    onClick={() => setShowAddModal(true)} // Open AddClientModal
                >
                    NEW CLIENT
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-b-2xl">
                <table className="table-auto border-collapse w-full rounded-b-2xl">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">First Name</th>
                            <th className="p-3">Last Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Sex</th>
                            <th className="p-3">Birth Date</th>
                            <th className="p-3">Address</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-100">
                                <td className="p-3">{client.firstName}</td>
                                <td className="p-3">{client.lastName}</td>
                                <td className="p-3">{client.email}</td>
                                <td className="p-3">{client.phone}</td>
                                <td className="p-3">{client.sex}</td>
                                <td className="p-3">{client.birthDate}</td>
                                <td className="p-3">{client.address}</td> {/* Ensure this is correct */}
                                <td className="p-3 flex space-x-2">
                                    <button className="text-blue-500 hover:bg-blue-100 p-2 rounded">
                                        <Edit size={18} />
                                    </button>
                                    <button className="text-green-500 hover:bg-green-100 p-2 rounded">
                                        <Eye size={18} />
                                    </button>
                                    <button className="text-red-500 hover:bg-red-100 p-2 rounded">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* AddClientModal */}
            <AddClientModal
                showModal={showAddModal}
                closeModal={() => setShowAddModal(false)}
                handleAddClient={handleAddClient} // Pass handleAddClient here
            />
        </div>
    );
};

export default AdminClientsTable;