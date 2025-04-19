import React from 'react'
import { Navbar, Sidebar, AdminCaseTable, Footer } from '../components';

const CasesPage = () => {
    return (
        <div className='min-h-screen flex flex-col bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]'>
            <Navbar />
            <div className='flex-grow'>
                <AdminCaseTable />
            </div>
            <Footer />
        </div>
    )
}

export default CasesPage
