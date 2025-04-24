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
  adminId,
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

  const [errors, setErrors] = useState({});
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

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    if (!formData.birthDate.trim()) newErrors.birthDate = "Required";
    if (!formData.password) newErrors.password = "Required";
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["region", "province", "city", "barangay"].includes(name)) {
      setLocationIds((prev) => ({ ...prev, [name]: value }));
      setFormData((prev) => ({ ...prev, [name]: value })); // Store the ID
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Generate the Client ID
    // const clientId = getNextClientId();

    // Prepare data for ClientAccountTable
    // const clientAccountData = {
    //   clientId,
    //   clientName: `${formData.firstName} ${formData.lastName}`,
    //   email: formData.email,
    //   phone: formData.phone,
    //   password: formData.password,
    // };

    // Prepare data for AdminClientsTable
    const payload = {
      adminId,
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
    console.log(payload);
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
      console.log(err);
      setServerMessage(err.response?.data?.message || "An error occurred.");
    }
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
              className={`text-sm mb-4 ${
                serverMessage.includes("successfully")
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Sex*</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                >
                  <option value="">Select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.sex && (
                  <p className="text-sm text-red-500">{errors.sex}</p>
                )}
              </div>
              {/* Birthdate */}
              <div>
                <label className="block text-sm font-medium">Birthdate*</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-500">{errors.birthDate}</p>
                )}
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium">Region*</label>
                <select
                  name="region"
                  value={locationIds.region}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
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
                <label className="block text-sm font-medium">Province*</label>
                <select
                  name="province"
                  value={locationIds.province}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
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
              </div>

              <div>
                <label className="block text-sm font-medium">
                  City/Municipality*
                </label>
                <select
                  name="city"
                  value={locationIds.city}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
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
              </div>

              <div>
                <label className="block text-sm font-medium">Barangay*</label>
                <select
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">ZIP Code*</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium">Password*</label>
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-300 rounded w-full px-3 py-2 pr-10"
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
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
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
                  className="border border-gray-300 rounded w-full px-3 py-2 pr-10"
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
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-md transition ${
                isLoading
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
