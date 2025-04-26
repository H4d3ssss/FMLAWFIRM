import React from 'react'
import { X } from 'lucide-react'

const PrivacyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex items-center  justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        <section className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this policy carefully.
                            </p>

                            <h3 className="text-xl font-semibold">1. Information We Collect</h3>
                            <p>
                                We collect personal information that you voluntarily provide to us, such as your name, email address, and other contact details when you register on our website or subscribe to our services.
                            </p>

                            <h3 className="text-xl font-semibold">2. How We Use Your Information</h3>
                            <p>
                                We use the information we collect to improve your experience on our website, send you updates and promotional materials, and respond to your inquiries.
                            </p>

                            <h3 className="text-xl font-semibold">3. Disclosure of Your Information</h3>
                            <p>
                                We do not sell, trade, or otherwise transfer your personal data to outside parties without your consent except as required by law or as necessary to fulfill your requests.
                            </p>

                            <h3 className="text-xl font-semibold">4. Security of Your Information</h3>
                            <p>
                                We implement a variety of security measures to maintain the safety of your personal information and protect it from unauthorized access or disclosure.
                            </p>

                            <h3 className="text-xl font-semibold">5. Your Rights</h3>
                            <p>
                                You have the right to access, update, or request the deletion of your personal information. Please contact us if you wish to exercise any of these rights.
                            </p>

                            <h3 className="text-xl font-semibold">6. Changes to This Privacy Policy</h3>
                            <p>
                                We may update this Privacy Policy from time to time. Any changes will be posted on this page and will take effect immediately upon posting.
                            </p>

                            <h3 className="text-xl font-semibold">7. Contact Us</h3>
                            <p>
                                If you have any questions or concerns regarding this Privacy Policy, please contact us at [Your Contact Information].
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
    )
}

export default PrivacyModal