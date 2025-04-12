import React from 'react';
import { ForgotPasswordForm, } from '../components'; // Import the ForgotPasswordForm
import bgImage from '../assets/bg.jpeg';

function ForgotPass() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: `url(${bgImage})`
                }}
            />
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 backdrop-brightness-50 z-50"></div>
            <div className="z-50 w-full max-w-md p-8 rounded-2xl shadow-lg bg-white">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}

export default ForgotPass;
