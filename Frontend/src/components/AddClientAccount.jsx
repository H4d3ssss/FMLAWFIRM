import React, { useState, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";
// import axios from "axios"; // Uncomment when backend integration is ready
import regionsData from "./data/regions.json";
import provincesData from "./data/provinces.json";
import citiesData from "./data/cities.json";
import barangaysData from "./data/barangays.json";
import axios from "axios";
const AddClientAccount = ({
  showModal,
  closeModal,
  refreshTables,
  getNextClientId,
  getClients,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    sex: "",
    houseNumber: "",
    streetName: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
  });

  // Enhanced error state with boolean values for each field
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    birthDate: false,
    sex: false,
    houseNumber: false,
    streetName: false,
    region: false,
    province: false,
    city: false,
    barangay: false,
    zipCode: false,
    password: false,
    confirmPassword: false,
  });

  // Track which fields have been touched by the user
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    birthDate: false,
    sex: false,
    houseNumber: false,
    streetName: false,
    region: false,
    province: false,
    city: false,
    barangay: false,
    zipCode: false,
    password: false,
    confirmPassword: false,
  });

  const [serverMessage, setServerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [locationIds, setLocationIds] = useState({
    region: "",
    province: "",
    city: "",
  });

  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredBarangays, setFilteredBarangays] = useState([]);

  // Reset location-based fields when region, province, or city changes
  useEffect(() => {
    if (locationIds.region) {
      const provinces = provincesData.filter(
        (p) => p.region_id === locationIds.region
      );
      setFilteredProvinces(provinces);
      setFormData((prev) => ({
        ...prev,
        province: "",
        city: "",
        barangay: "",
      }));
      setLocationIds((prev) => ({ ...prev, province: "", city: "" }));
      setFilteredCities([]);
      setFilteredBarangays([]);
    }
  }, [locationIds.region]);

  useEffect(() => {
    if (locationIds.province) {
      const cities = citiesData.filter(
        (c) =>
          c.province_id === locationIds.province &&
          c.region_id === locationIds.region
      );
      setFilteredCities(cities);
      setFormData((prev) => ({ ...prev, city: "", barangay: "" }));
      setLocationIds((prev) => ({ ...prev, city: "" }));
      setFilteredBarangays([]);
    }
  }, [locationIds.province, locationIds.region]);

  useEffect(() => {
    if (locationIds.city) {
      const barangays = barangaysData.filter(
        (b) =>
          b.city_id === locationIds.city &&
          b.province_id === locationIds.province &&
          b.region_id === locationIds.region
      );
      setFilteredBarangays(barangays);
      setFormData((prev) => ({ ...prev, barangay: "" }));
    }
  }, [locationIds.city, locationIds.province, locationIds.region]);

  // Generic onBlur handler for all fields
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let hasError = false;
    const value = formData[field];

    // Field-specific validation
    if (field === 'email') {
      hasError = !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (field === 'password') {
      hasError = !value || value.length < 6;
    } else if (field === 'confirmPassword') {
      hasError = !value || value !== formData.password;
    } else {
      // General validation for other fields
      hasError = !value || value.trim() === '';
    }

    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  const validate = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      phone: !formData.phone.trim(),
      birthDate: !formData.birthDate.trim(),
      sex: !formData.sex,
      houseNumber: !formData.houseNumber.trim(),
      streetName: !formData.streetName.trim(),
      region: !formData.region,
      province: !formData.province,
      city: !formData.city,
      barangay: !formData.barangay,
      zipCode: !formData.zipCode.trim(),
      password: !formData.password || formData.password.length < 6,
      confirmPassword: formData.password !== formData.confirmPassword,
    };

    setErrors(newErrors);

    // Mark all fields as touched to show all errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      birthDate: true,
      sex: true,
      houseNumber: true,
      streetName: true,
      region: true,
      province: true,
      city: true,
      barangay: true,
      zipCode: true,
      password: true,
      confirmPassword: true,
    });

    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["region", "province", "city"].includes(name)) {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const locationName = selectedOption.text;
      setLocationIds((prev) => ({ ...prev, [name]: value }));
      setFormData((prev) => ({ ...prev, [name]: locationName }));
      setErrors((prev) => ({ ...prev, [name]: false }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNumber: formData.phone,
      sex: formData.sex,
      dateOfBirth: formData.birthDate,
      address: `${formData.houseNumber}, ${formData.streetName}, ${formData.barangay}, ${formData.city}, ${formData.province}, ${formData.region}, ${formData.zipCode}`,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup", // Backend endpoint
        payload
      );
      console.log(response);
      setServerMessage("Client account successfully added.");
      refreshTables(); // Refresh ClientAccountTable and AdminClientsTable
      closeModal(); // Close the modal
    } catch (err) {
      console.log(err.response.data.error);
      setServerMessage(err.response.data.error || "An error occurred.");
    }
    setIsLoading(false);
    getClients();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-green-500 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Add Client Account</h2>
          <button
            onClick={closeModal}
            className="text-white hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {serverMessage && (
            <p
              className={`text-sm mb-4 ${serverMessage.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
                }`}
            >
              {serverMessage}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                  className={`border rounded w-full px-3 py-2 ${errors.firstName && touched.firstName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-xs mt-1">First name is required</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lastName")}
                  className={`border rounded w-full px-3 py-2 ${errors.lastName && touched.lastName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 text-xs mt-1">Last name is required</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`border rounded w-full px-3 py-2 ${errors.email && touched.email ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {!formData.email.trim() ? "Email is required" : "Invalid email format"}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium">Phone*</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  className={`border rounded w-full px-3 py-2 ${errors.phone && touched.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-xs mt-1">Phone number is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Sex*</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  onBlur={() => handleBlur("sex")}
                  className={`border rounded w-full px-3 py-2 ${errors.sex && touched.sex ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                >
                  <option value="">Select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.sex && touched.sex && (
                  <p className="text-red-500 text-xs mt-1">Sex is required</p>
                )}
              </div>
              {/* Birthdate */}
              <div>
                <label className="block text-sm font-medium">Birthdate*</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  onBlur={() => handleBlur("birthDate")}
                  className={`border rounded w-full px-3 py-2 ${errors.birthDate && touched.birthDate ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.birthDate && touched.birthDate && (
                  <p className="text-red-500 text-xs mt-1">Birthdate is required</p>
                )}
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium">Region*</label>
                <select
                  name="region"
                  value={locationIds.region}
                  onChange={handleChange}
                  onBlur={() => handleBlur("region")}
                  className={`border rounded w-full px-3 py-2 ${errors.region && touched.region ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                >
                  <option value="">Select Region</option>
                  {regionsData.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.region && touched.region && (
                  <p className="text-red-500 text-xs mt-1">Region is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Province*</label>
                <select
                  name="province"
                  value={locationIds.province}
                  onChange={handleChange}
                  onBlur={() => handleBlur("province")}
                  className={`border rounded w-full px-3 py-2 ${errors.province && touched.province ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  disabled={!filteredProvinces.length}
                  required
                >
                  <option value="">Select Province</option>
                  {filteredProvinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.province && touched.province && (
                  <p className="text-red-500 text-xs mt-1">Province is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  City/Municipality*
                </label>
                <select
                  name="city"
                  value={locationIds.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur("city")}
                  className={`border rounded w-full px-3 py-2 ${errors.city && touched.city ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  disabled={!filteredCities.length}
                  required
                >
                  <option value="">Select City</option>
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.city && touched.city && (
                  <p className="text-red-500 text-xs mt-1">City is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Barangay*</label>
                <select
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  onBlur={() => handleBlur("barangay")}
                  className={`border rounded w-full px-3 py-2 ${errors.barangay && touched.barangay ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  disabled={!filteredBarangays.length}
                  required
                >
                  <option value="">Select Barangay</option>
                  {filteredBarangays.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {errors.barangay && touched.barangay && (
                  <p className="text-red-500 text-xs mt-1">Barangay is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  House/Block No.*
                </label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur("houseNumber")}
                  className={`border rounded w-full px-3 py-2 ${errors.houseNumber && touched.houseNumber ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.houseNumber && touched.houseNumber && (
                  <p className="text-red-500 text-xs mt-1">House/Block No. is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Street Name*
                </label>
                <input
                  type="text"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("streetName")}
                  className={`border rounded w-full px-3 py-2 ${errors.streetName && touched.streetName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.streetName && touched.streetName && (
                  <p className="text-red-500 text-xs mt-1">Street name is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">ZIP Code*</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  onBlur={() => handleBlur("zipCode")}
                  className={`border rounded w-full px-3 py-2 ${errors.zipCode && touched.zipCode ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                {errors.zipCode && touched.zipCode && (
                  <p className="text-red-500 text-xs mt-1">ZIP code is required</p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium">Password*</label>
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`border rounded w-full px-3 py-2 pr-10 ${errors.password && touched.password ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {showPassword.password ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {!formData.password ? "Password is required" : "Password must be at least 6 characters"}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium">
                  Confirm Password*
                </label>
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`border rounded w-full px-3 py-2 pr-10 ${errors.confirmPassword && touched.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {!formData.confirmPassword ? "Confirm password is required" : "Passwords do not match"}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-md transition ${isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
                }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Add Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClientAccount;
