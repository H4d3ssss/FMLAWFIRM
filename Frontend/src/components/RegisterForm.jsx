import React, { useState, useEffect } from "react";
import regionsData from "./data/regions.json";
import provincesData from "./data/provinces.json";
import citiesData from "./data/cities.json";
import barangaysData from "./data/barangays.json";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    age: "",
    sex: "",
    phone: "",
    houseNumber: "",
    streetName: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    zipCode: "",
    acceptedTerms: false,
  });

  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredBarangays, setFilteredBarangays] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      setFormData((prev) => ({ ...prev, age }));
    }
  }, [formData.birthDate]);

  useEffect(() => {
    const provinces = provincesData.filter(
      (p) => p.region_id === formData.region
    );
    setFilteredProvinces(provinces);
    setFormData((prev) => ({ ...prev, province: "", city: "", barangay: "" }));
    setFilteredCities([]);
    setFilteredBarangays([]);
  }, [formData.region]);

  useEffect(() => {
    const cities = citiesData.filter(
      (c) =>
        c.province_id === formData.province && c.region_id === formData.region
    );
    setFilteredCities(cities);
    setFormData((prev) => ({ ...prev, city: "", barangay: "" }));
    setFilteredBarangays([]);
  }, [formData.province, formData.region]);

  useEffect(() => {
    const barangays = barangaysData.filter(
      (b) =>
        b.city_id === formData.city &&
        b.province_id === formData.province &&
        b.region_id === formData.region
    );
    setFilteredBarangays(barangays);
    setFormData((prev) => ({ ...prev, barangay: "" }));
  }, [formData.city, formData.province, formData.region]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.birthDate) newErrors.birthDate = "Required";
    if (!formData.sex) newErrors.sex = "Required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    if (!formData.houseNumber.trim()) newErrors.houseNumber = "Required";
    if (!formData.streetName.trim()) newErrors.streetName = "Required";
    if (!formData.region) newErrors.region = "Required";
    if (!formData.province) newErrors.province = "Required";
    if (!formData.city) newErrors.city = "Required";
    if (!formData.barangay) newErrors.barangay = "Required";
    if (!/^\d{4,5}$/.test(formData.zipCode)) newErrors.zipCode = "4–5 digits";
    if (!formData.password) newErrors.password = "Required";
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.acceptedTerms)
      newErrors.acceptedTerms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const fullAddress = `${formData.houseNumber}, ${formData.streetName}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.region}, ${formData.zipCode}`;

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      address: fullAddress,
      dateOfBirth: formData.birthDate,
      contactNumber: formData.phone,
      sex: formData.sex,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        payload
      );
      setServerMessage(
        response.status === 202
          ? "Wait for admin's approval"
          : "Successfully signed up!"
      );
    } catch (err) {
      setServerMessage(err.response?.data?.error || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Create Your Account
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name*
                </label>
                <input
                  name="firstName"
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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

            {/* Birthdate + Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Birth Date*
                </label>
                <input
                  name="birthDate"
                  type="date"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  max={new Date().toISOString().split("T")[0]}
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-600">{errors.birthDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  name="age"
                  type="text"
                  readOnly
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  value={formData.age || ""}
                />
              </div>
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
              {errors.sex && (
                <p className="text-sm text-red-600">{errors.sex}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number*
              </label>
              <input
                name="phone"
                type="text"
                maxLength={17}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="+63 999-999-9999"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Address Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  House/Block No.*
                </label>
                <input
                  name="houseNumber"
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.houseNumber}
                  onChange={handleChange}
                />
                {errors.houseNumber && (
                  <p className="text-sm text-red-600">{errors.houseNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street Name*
                </label>
                <input
                  name="streetName"
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.streetName}
                  onChange={handleChange}
                />
                {errors.streetName && (
                  <p className="text-sm text-red-600">{errors.streetName}</p>
                )}
              </div>
            </div>
            {/* Region + Province */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Region*
                </label>
                <select
                  name="region"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.region}
                  onChange={handleChange}
                >
                  <option value="">Select Region</option>
                  {regionsData.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Province*
                </label>
                <select
                  name="province"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.province}
                  onChange={handleChange}
                  disabled={!filteredProvinces.length}
                >
                  <option value="">Select Province</option>
                  {filteredProvinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City + Barangay */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City/Municipality*
                </label>
                <select
                  name="city"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!filteredCities.length}
                >
                  <option value="">Select City</option>
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Barangay*
                </label>
                <select
                  name="barangay"
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.barangay}
                  onChange={handleChange}
                  disabled={!filteredBarangays.length}
                >
                  <option value="">Select Barangay</option>
                  {filteredBarangays.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code*
              </label>
              <input
                name="zipCode"
                type="text"
                maxLength={5}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                value={formData.zipCode}
                onChange={handleChange}
              />
              {errors.zipCode && (
                <p className="text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword.password ? "text" : "password"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {showPassword.password ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password*
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start mt-4">
          <input
            name="acceptedTerms"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            checked={formData.acceptedTerms}
            onChange={handleChange}
          />
          <div className="ml-3 text-sm text-gray-700">
            I agree to the terms and privacy policy.
            {errors.acceptedTerms && (
              <p className="text-sm text-red-600">{errors.acceptedTerms}</p>
            )}
          </div>
        </div>

        {serverMessage && (
          <p
            className={`text-sm text-center ${
              serverMessage.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {serverMessage}
          </p>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded-md transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Register"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="./LoginPage"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
