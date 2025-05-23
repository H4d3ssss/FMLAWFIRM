import React, { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components';
import ClientNavbar from '../components/ClientNavbar'; // Import the ClientNavbar
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage = () => {
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

            {/* Main content area with horizontal margins to avoid sidebar overlap */}
            <div className="flex flex-1">
                <div className="mx-0 sm:mx-48 flex-grow">
                    <div className="container mx-auto px-4 py-8">
                        {/* White card container for better readability */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
                            <section className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully.
                                </p>

                                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                                <p>
                                    We collect personal information that you voluntarily provide to us, such as your name, email address, and other contact details when you register on our website or subscribe to our services.
                                </p>

                                <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
                                <p>
                                    We use the information we collect to improve your experience on our website, send you updates and promotional materials, and respond to your inquiries.
                                </p>

                                <h2 className="text-2xl font-semibold">3. Disclosure of Your Information</h2>
                                <p>
                                    We do not sell, trade, or otherwise transfer your personal data to outside parties without your consent except as required by law or as necessary to fulfill your requests.
                                </p>

                                <h2 className="text-2xl font-semibold">4. Security of Your Information</h2>
                                <p>
                                    We implement a variety of security measures to maintain the safety of your personal information and protect it from unauthorized access or disclosure.
                                </p>

                                <h2 className="text-2xl font-semibold">5. Your Rights</h2>
                                <p>
                                    You have the right to access, update, or request the deletion of your personal information. Please contact us if you wish to exercise any of these rights.
                                </p>

                                <h2 className="text-2xl font-semibold">6. Changes to This Privacy Policy</h2>
                                <p>
                                    We may update this Privacy Policy from time to time. Any changes will be posted on this page and will take effect immediately upon posting.
                                </p>

                                <h2 className="text-2xl font-semibold">7. Contact Us</h2>
                                <p>
                                    If you have any questions or concerns regarding this Privacy Policy, please contact us at [Your Contact Information].
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer remains at the bottom */}
            <Footer />
        </div>
    );
};

export default PrivacyPage;
