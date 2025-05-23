import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components';
import ClientNavbar from '../components/ClientNavbar'; // Import the ClientNavbar
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Check if user is authenticated
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/auth/authenticate-user",
                    { withCredentials: true }
                );
                if (response.data && response.data.role) {
                    setUserRole(response.data.role);
                } else {
                    setUserRole(null);
                }
            } catch (error) {
                console.log("Not authenticated:", error);
                setUserRole(null);
            }
        };

        checkAuthStatus();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F9C545] to-[#FFFFFF]">
            {/* Conditional rendering based on user role */}
            {userRole === "Lawyer" ? (
                <Navbar />
            ) : userRole === "Client" ? (
                <ClientNavbar />
            ) : (
                <div className="bg-[#F9C545] p-4 shadow-md">
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-white text-[#F9C545] font-bold rounded-md shadow hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Login
                    </Link>
                </div>
            )}

            {/* Main content area with left margin to avoid sidebar overlap */}
            <div className="flex flex-1">
                <div className="ml-0 sm:mx-48 flex-grow">
                    <div className="container mx-auto px-4 py-8">
                        {/* White card container for better readability */}
                        <div className="bg-[#FFB600] rounded-lg shadow-md p-8">
                            <h1 className="text-4xl font-extrabold mb-6">Terms of Service</h1>
                            <section className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    Welcome to our website. These Terms of Service ("Terms") govern your use of our website and services. Please read them carefully.
                                </p>

                                <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                                <p>
                                    By accessing and using this website, you agree to be bound by these Terms and all applicable laws and regulations.
                                </p>

                                <h2 className="text-2xl font-semibold">2. Changes to Terms</h2>
                                <p>
                                    We reserve the right to modify these Terms at any time. Any changes will be posted on this page and will become effective immediately after posting.
                                </p>

                                <h2 className="text-2xl font-semibold">3. Use of the Website</h2>
                                <p>
                                    You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others.
                                </p>

                                <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
                                <p>
                                    All content, features, and functionality on the website are the exclusive property of the Company and are protected by applicable laws.
                                </p>

                                <h2 className="text-2xl font-semibold">5. Termination</h2>
                                <p>
                                    We reserve the right to terminate or suspend your access to the website at any time without notice for any reason.
                                </p>

                                <h2 className="text-2xl font-semibold">6. Contact Us</h2>
                                <p>
                                    If you have any questions about these Terms, please feel free to contact us at [Your Contact Information].
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer at the bottom */}
            <Footer />
        </div>
    );
};

export default TermsPage;
