import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Import icons for show/hide password

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );
      console.log(response.data.role);
      if (response.data.role === "Lawyer") {
        navigate("/admindashboard");
      } else if (response.data.role === "Client") {
        navigate("/clientdashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
      console.log(error);
      if (error.status === 401) {
        setResponse(error.response.data.message);
      } else if (error.status === 409) {
        setResponse(error.response.data.message);
      } else if (error.status === 400) {
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

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );

        console.log(response.data);
        if (response.data.role === "Lawyer") {
          navigate("/admindashboard");
        } else if (response.data.role === "Client") {
          navigate("/clientdashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    authenticateUser();
  }, []);

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: '"Jacques Francois", cursive' }}>F&M Law Firm</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Email Address
          </h2>
          <input
            name="email"
            type="email"
            className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Password</h2>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"} // Toggle input type
              className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500`}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
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

          <Link
            to="/ForgotPass"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot your password?
          </Link>
        </div>
        {response && <p className="text-sm text-red-600 mt-1">{response}</p>}
        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#FFB600] text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Log in
        </button>
      </form>

      {/* Create Account Link */}
      <div className="mt-4 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
