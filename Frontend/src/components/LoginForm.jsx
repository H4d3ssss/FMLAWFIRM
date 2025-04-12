<<<<<<< HEAD
import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Email format is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        console.log('Login attempt:', formData);
        // Proceed with login logic
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Log in</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <h2 className="text-sm font-medium text-gray-700 mb-2">Email Address</h2>
                    <input
                        name="email"
                        type="email"
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <h2 className="text-sm font-medium text-gray-700 mb-2">Password</h2>
                    <input
                        name="password"
                        type="password"
                        className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>

                    <Link to="/ForgotPass" className="text-sm text-blue-600 hover:text-blue-500">
                        Forgot your password?
                    </Link>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Log in
                </button>
            </form>

            {/* Create Account Link */}
            <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                    Create one
                </Link>
            </div>
        </div>
    );
}

export default LoginForm;
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // console.log("Login attempt:", formData);
    // Proceed with login logic
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );
      console.log(response);
      navigate("/dashboard"); // testing lang kung gumagana login ahahahah
    } catch (error) {
      console.log(error.status);
      if (error.status === 401) {
        console.log(error.response.data.message);
        setResponse(error.response.data.message);
      } else if (error.status === 409) {
        console.log(error.response.data.message);
        setResponse(error.response.data.message);
      } else if (error.status === 400) {
        console.log(error.response.data.message);
        setResponse(error.response.data.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-md p-6 bg-white rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2">Remember me</span>
          </label>
          <div className="text-sm">
            <a
              href="/forgot-password"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        {response && <p className="text-sm text-red-600 mt-1">{response}</p>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </button>
        </div>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
>>>>>>> 68271b81ed458b5044393788eac4f7d8b8f7c096
