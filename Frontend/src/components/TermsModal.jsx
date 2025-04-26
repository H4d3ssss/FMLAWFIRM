import React from 'react';
import { X } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-[#FFB600] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <X className="h-6 w-6 text-black" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        <section className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                Welcome to our website. These Terms of Service ("Terms") govern your use of our website and services. Please read them carefully.
                            </p>

                            <h3 className="text-xl font-semibold">1. Acceptance of Terms</h3>
                            <p>
                                By accessing and using this website, you agree to be bound by these Terms and all applicable laws and regulations.
                            </p>

                            <h3 className="text-xl font-semibold">2. Changes to Terms</h3>
                            <p>
                                We reserve the right to modify these Terms at any time. Any changes will be posted on this page and will become effective immediately after posting.
                            </p>

                            <h3 className="text-xl font-semibold">3. Use of the Website</h3>
                            <p>
                                You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others.
                            </p>

                            <h3 className="text-xl font-semibold">4. Intellectual Property</h3>
                            <p>
                                All content, features, and functionality on the website are the exclusive property of the Company and are protected by applicable laws.
                            </p>

                            <h3 className="text-xl font-semibold">5. Termination</h3>
                            <p>
                                We reserve the right to terminate or suspend your access to the website at any time without notice for any reason.
                            </p>

                            <h3 className="text-xl font-semibold">6. Contact Us</h3>
                            <p>
                                If you have any questions about these Terms, please feel free to contact us at [Your Contact Information].
                            </p>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-[#F9C545] text-white rounded-md hover:bg-[#E68900] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
