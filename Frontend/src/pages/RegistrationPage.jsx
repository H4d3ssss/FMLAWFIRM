import React from 'react';
import RegisterForm from '../components/RegisterForm';
import bgImage from '../assets/bg.jpeg'; // Import the image
import { Footer } from '../components';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function RegistrationPage() {
    return (
        <div className="min-h-screen">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: `url(${bgImage})`
                }}
            />

            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 backdrop-brightness-50 z-10"></div>


            {/* Main Content */}
            <main className="relative z-20 flex-grow flex items-center justify-center min-h-screen">
                <div className="w-full max-w-2xl">
                    <RegisterForm />
                </div>
            </main>

            {/* Footer */}

            <Footer />

        </div>
    );
}

export default RegistrationPage;