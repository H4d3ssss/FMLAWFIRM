import React from 'react'
import { Navbar, Footer, AdminAccountTable, ClientAccountTable, AccountApprovalTable, } from '../components';
const AccountsPage = () => {
    return (
        <>
            <Navbar />
            <AdminAccountTable />
            <ClientAccountTable />
            <AccountApprovalTable />
            <Footer />
        </>
    )
}

export default AccountsPage