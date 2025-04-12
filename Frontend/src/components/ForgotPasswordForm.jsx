import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/send-reset-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset link sent to your email');
            } else {
                setMessage(data.error || 'Error sending reset link');
            }
        } catch (error) {
            setMessage('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Forgot your password</h1>
                <p className="text-gray-600 mt-2 text-sm">
                    Please enter the email address you'd like your password reset information sent to:
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Registered Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                {message && (
                    <p className={`text-center text-sm ${message.includes('sent') ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {message}
                    </p>
                )}
            </form>

            <div className="mt-4 text-center">
                <div >
                    <Link to="/LoginPage" className="text-blue-500 hover:underline focus:outline-none" >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;