import React from 'react';
import { Navbar, Footer, AdminAccountTable, ClientAccountTable, AccountApprovalTable } from '../components';

const AccountsPage = () => {
    // Mock data for admins
    const admins = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            status: "Active",
            position: "Manager",
            password: "password123",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            status: "Archived",
            position: "Assistant",
            password: "password456",
        },
        {
            id: 3,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            status: "Active",
            position: "Supervisor",
            password: "password789",
        },
    ];

    // Mock data for clients
    const clients = [
        {
            id: 1,
            name: "Client A",
            email: "client.a@example.com",
            phone: "123-456-7890",
            status: "Active",
        },
        {
            id: 2,
            name: "Client B",
            email: "client.b@example.com",
            phone: "987-654-3210",
            status: "Archived",
        },
        {
            id: 3,
            name: "Client C",
            email: "client.c@example.com",
            phone: "555-555-5555",
            status: "Active",
        },
    ];

    // Mock data for approvals
    const approvals = [
        {
            id: 1,
            name: "Jesse Pinkman",
            email: "jesse_pinkman@hotmail.com",
            phone: "5636876338737",
            password: "password123",
        },
        {
            id: 2,
            name: "Walter White",
            email: "walter_white@gmail.com",
            phone: "9876543210",
            password: "password456",
        },
        {
            id: 3,
            name: "Saul Goodman",
            email: "saul_goodman@lawyer.com",
            phone: "5555555555",
            password: "password789",
        },
    ];

    const handleView = (admin) => {
        console.log("View admin:", admin);
    };

    const handleEdit = (admin) => {
        console.log("Edit admin:", admin);
    };

    const handleArchive = (adminId) => {
        console.log("Archive admin with ID:", adminId);
    };

    const handleEditClient = (client) => {
        console.log("Edit client:", client);
    };

    const handleArchiveClient = (clientId) => {
        console.log("Archive client with ID:", clientId);
    };

    const handleApprove = (approvalId) => {
        console.log("Approved account with ID:", approvalId);
    };

    const handleReject = (approvalId) => {
        console.log("Rejected account with ID:", approvalId);
    };

    return (
        <div className="bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
            <Navbar />
            <main>
                <AdminAccountTable
                    admins={admins}
                    onView={handleView}
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                />
                <ClientAccountTable
                    clients={clients}
                    onEdit={handleEditClient}
                    onArchive={handleArchiveClient}
                />
                <AccountApprovalTable
                    approvals={approvals}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            </main>
            <Footer />
        </div>
    );
};

export default AccountsPage;