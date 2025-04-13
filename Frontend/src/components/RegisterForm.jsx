import React, { useState, useEffect } from "react";
import axios from "axios";
function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "", // Restored birthDate
    age: "",
    sex: "",
    gender: "",
    address: "",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-calculate age from birthDate
  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.birthDate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required"; // Validation for birthDate
    if (!formData.sex) newErrors.sex = "Sex is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.acceptedTerms)
      newErrors.acceptedTerms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      address: formData.address,
      dateOfBirth: formData.birthDate, // Include birthDate in payload
      sex: formData.sex,
      //   age: formData.age,
      //   gender: formData.gender,
    };

    try {
      //   const res = await fetch("http://localhost:3000/api/auth/signup", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(payload),
      //   });

      //   const data = await res.json();
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        payload
      );
      console.log(response.status);
      setServerMessage(
        response.status === 202
          ? "Wait for admin's approval"
          : response.status === 200 &&
          "Successfully signed up! Wait for admin's approval"
      );
    } catch (err) {
      setServerMessage(err.response.data.error);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">
          Create Your Account
        </h2>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name*
            </label>
            <input
              name="firstName"
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.firstName}
              onChange={handleChange}
              autoFocus
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name*
            </label>
            <input
              name="lastName"
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email*
          </label>
          <input
            name="email"
            type="email"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Birth Date & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700"
            >
              Birth Date*
            </label>
            <input
              name="birthDate"
              type="date"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.birthDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
            />
            {errors.birthDate && (
              <p className="text-sm text-red-600">{errors.birthDate}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              name="age"
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              value={formData.age || ""}
              readOnly
            />
          </div>
        </div>

        {/* Sex & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sex"
              className="block text-sm font-medium text-gray-700"
            >
              Sex*
            </label>
            <select
              name="sex"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.sex && <p className="text-sm text-red-600">{errors.sex}</p>}
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender*
            </label>
            <select
              name="gender"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-600">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address*
          </label>
          <input
            name="address"
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && (
            <p className="text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password*
            </label>
            <input
              name="password"
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password*
            </label>
            <input
              name="confirmPassword"
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              name="acceptedTerms"
              type="checkbox"
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              checked={formData.acceptedTerms}
              onChange={handleChange}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="acceptedTerms"
              className="font-medium text-gray-700"
            >
              I agree to the terms
            </label>
            <p className="text-xs text-gray-500 mt-1">
              By creating an account, you agree to abide by the firm's data
              privacy policies and security protocols. You acknowledge that all
              case files and client information accessed through this system are
              confidential and must not be shared, altered, or used without
              proper authorization. Unauthorized access or misuse of this system
              may result in legal action and account suspension.
            </p>
            {errors.acceptedTerms && (
              <p className="text-sm text-red-600">{errors.acceptedTerms}</p>
            )}
          </div>
        </div>

        {/* Server Message */}
        {serverMessage && (
          <p
            className={`text-center text-sm ${serverMessage.includes("created")
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {serverMessage}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 rounded-md transition ${isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
