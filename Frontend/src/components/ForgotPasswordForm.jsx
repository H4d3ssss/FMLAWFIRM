import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/resetpassword",
        { email }
      );
      const temporaryPassword = response.data.temporaryPassword;
      // console.log(response.data);

      const payLoad = {
        service_id: "service_93zdpcs",
        template_id: "template_fyaiqlb",
        user_id: "UYxRLIP8V3EKdcBdM",
        template_params: {
          from_email: "jbialen@mtivalenzuela.edu.ph",
          to_email: email,
          temporaryPassword,
          fullName: response.data.fullName,
        },
      };

      try {
        const result = await axios.post(
          "https://api.emailjs.com/api/v1.0/email/send",
          payLoad,
          {
            headers: "application/json",
          }
        );

        console.log(payLoad);
        console.log(result);
        setMessage("Temporary password sent successfully.");
      } catch (error) {
        console.error("Error sending email:", error);
        setMessage("Failed to send email. Please try again.");
        setIsLoading(false);
        return;
      }

      if (response.status === 200) {
        console.log("eto yon");
        setMessage(response.data.message);
      } else {
        setMessage("Error sending reset link.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("Connection error. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Forgot your password
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Please enter the email address you'd like your password reset
          information sent to:
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
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("sent") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      <div className="mt-4 text-center">
        <div>
          <Link
            to="/"
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
