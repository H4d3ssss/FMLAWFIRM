import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#FFB600] py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0">
                    <h2
                        className="text-xl md:text-2xl font-extrabold text-black"
                        style={{ fontFamily: '"Jacques Francois", cursive' }}
                    >
                        F&M LAW FIRM
                    </h2>
                    <div className="mt-4 sm:mt-0">
                        <p className="text-sm text-gray-700">
                            © 2025 F&M Law Firm. Designed by R.Dev™
                        </p>
                    </div>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <Link
                            to="/terms"
                            className="text-sm text-gray-700 hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/privacy"
                            className="text-sm text-gray-700 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
