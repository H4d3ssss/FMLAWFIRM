import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import regionsData from "./data/regions.json";
import provincesData from "./data/provinces.json";
import citiesData from "./data/cities.json";
import barangaysData from "./data/barangays.json";
import axios from "axios";

const AddClientModal = ({
  showModal,
  closeModal,
  handleAddClient,
  nextClientId,
}) => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    sex: "",
    phone: "",
    houseNumber: "",
    streetName: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    zipCode: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [locationIds, setLocationIds] = useState({
    region: "",
    province: "",
    city: "",
  });

  // Enhanced error state with boolean values for each field
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    birthDate: false,
    sex: false,
    phone: false,
    houseNumber: false,
    streetName: false,
    region: false,
    province: false,
    city: false,
    barangay: false,
    zipCode: false,
  });

  // Track which fields have been touched by the user
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    birthDate: false,
    sex: false,
    phone: false,
    houseNumber: false,
    streetName: false,
    region: false,
    province: false,
    city: false,
    barangay: false,
    zipCode: false,
  });

  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredBarangays, setFilteredBarangays] = useState([]);

  // Reset form data when the modal is reopened
  useEffect(() => {
    if (!showModal) {
      setFormData(initialFormData);
      setLocationIds({ region: "", province: "", city: "" });
      setFilteredProvinces([]);
      setFilteredCities([]);
      setFilteredBarangays([]);
      setErrors({});
      setTouched({});
    }
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      setFormData((prev) => ({ ...prev, clientId: nextClientId })); // Update clientId when modal opens
    }
  }, [showModal, nextClientId]);

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
    } else if (field === 'phone') {
      hasError = !value || value.trim() === '';
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
      birthDate: !formData.birthDate.trim(),
      sex: !formData.sex,
      phone: !formData.phone.trim(),
      houseNumber: !formData.houseNumber.trim(),
      streetName: !formData.streetName.trim(),
      region: !formData.region,
      province: !formData.province,
      city: !formData.city,
      barangay: !formData.barangay,
      zipCode: !formData.zipCode.trim(),
    };

    setErrors(newErrors);

    // Mark all fields as touched to show all errors
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      birthDate: true,
      sex: true,
      phone: true,
      houseNumber: true,
      streetName: true,
      region: true,
      province: true,
      city: true,
      barangay: true,
      zipCode: true,
    });

    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["region", "province", "city", "barangay"].includes(name)) {
      setLocationIds((prev) => ({ ...prev, [name]: value }));
      setFormData((prev) => ({ ...prev, [name]: value })); // Store the ID
      setErrors((prev) => ({ ...prev, [name]: false }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const regionName =
      regionsData.find((r) => r.id === locationIds.region)?.name || "";
    const provinceName =
      provincesData.find((p) => p.id === locationIds.province)?.name || "";
    const cityName =
      citiesData.find((c) => c.id === locationIds.city)?.name || "";
    const barangayName =
      barangaysData.find((b) => b.id === formData.barangay)?.name || "";

    const fullAddress = `${formData.houseNumber}, ${formData.streetName}, ${barangayName}, ${cityName}, ${provinceName}, ${regionName}, ${formData.zipCode}`;
    const clientData = {
      ...formData,
      fullAddress,
    };

    handleAddClient(clientData); // Pass clientData to AdminClientsTable
    closeModal(); // Close the modal after submission
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-green-400 p-4 rounded-t-lg flex justify-center items-center">
          <h2 className="text-lg font-bold">Add New Client</h2>
        </div>
        <div className="absolute top-4 right-4">
          <button onClick={closeModal} className="text-black text-xl font-bold">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client ID (Read-Only) */}
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium">
                  Client ID
                </label>
                <input
                  type="text"
                  id="clientId"
                  name="clientId"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={formData.clientId}
                  readOnly
                />
              </div>

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`border rounded w-full px-3 py-2 ${errors.firstName && touched.firstName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                  required
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 text-xs mt-1">First name is required</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`border rounded w-full px-3 py-2 ${errors.lastName && touched.lastName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lastName")}
                  required
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 text-xs mt-1">Last name is required</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`border rounded w-full px-3 py-2 ${errors.email && touched.email ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  required
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {!formData.email.trim() ? "Email is required" : "Invalid email format"}
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium"
                >
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className={`border rounded w-full px-3 py-2 ${errors.birthDate && touched.birthDate ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.birthDate}
                  onChange={handleChange}
                  onBlur={() => handleBlur("birthDate")}
                  required
                />
                {errors.birthDate && touched.birthDate && (
                  <p className="text-red-500 text-xs mt-1">Birth date is required</p>
                )}
              </div>

              {/* Sex */}
              <div>
                <label htmlFor="sex" className="block text-sm font-medium">
                  Sex
                </label>
                <select
                  id="sex"
                  name="sex"
                  className={`border rounded w-full px-3 py-2 ${errors.sex && touched.sex ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.sex}
                  onChange={handleChange}
                  onBlur={() => handleBlur("sex")}
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.sex && touched.sex && (
                  <p className="text-red-500 text-xs mt-1">Sex is required</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className={`border rounded w-full px-3 py-2 ${errors.phone && touched.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  placeholder="+63 999-999-9999"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  required
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-xs mt-1">Phone number is required</p>
                )}
              </div>

              {/* House/Block No. */}
              <div>
                <label
                  htmlFor="houseNumber"
                  className="block text-sm font-medium"
                >
                  House/Block No.
                </label>
                <input
                  type="text"
                  id="houseNumber"
                  name="houseNumber"
                  className={`border rounded w-full px-3 py-2 ${errors.houseNumber && touched.houseNumber ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.houseNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur("houseNumber")}
                  required
                />
                {errors.houseNumber && touched.houseNumber && (
                  <p className="text-red-500 text-xs mt-1">House/Block No. is required</p>
                )}
              </div>

              {/* Street Name */}
              <div>
                <label
                  htmlFor="streetName"
                  className="block text-sm font-medium"
                >
                  Street Name
                </label>
                <input
                  type="text"
                  id="streetName"
                  name="streetName"
                  className={`border rounded w-full px-3 py-2 ${errors.streetName && touched.streetName ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.streetName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("streetName")}
                  required
                />
                {errors.streetName && touched.streetName && (
                  <p className="text-red-500 text-xs mt-1">Street name is required</p>
                )}
              </div>

              {/* Region */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium">
                  Region
                </label>
                <select
                  id="region"
                  name="region"
                  className={`border rounded w-full px-3 py-2 ${errors.region && touched.region ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={locationIds.region}
                  onChange={handleChange}
                  onBlur={() => handleBlur("region")}
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

              {/* Province */}
              <div>
                <label htmlFor="province" className="block text-sm font-medium">
                  Province
                </label>
                <select
                  id="province"
                  name="province"
                  className={`border rounded w-full px-3 py-2 ${errors.province && touched.province ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={locationIds.province}
                  onChange={handleChange}
                  onBlur={() => handleBlur("province")}
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

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium">
                  City/Municipality
                </label>
                <select
                  id="city"
                  name="city"
                  className={`border rounded w-full px-3 py-2 ${errors.city && touched.city ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={locationIds.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur("city")}
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

              {/* Barangay */}
              <div>
                <label htmlFor="barangay" className="block text-sm font-medium">
                  Barangay
                </label>
                <select
                  id="barangay"
                  name="barangay"
                  className={`border rounded w-full px-3 py-2 ${errors.barangay && touched.barangay ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.barangay}
                  onChange={handleChange}
                  onBlur={() => handleBlur("barangay")}
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

              {/* ZIP Code */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  className={`border rounded w-full px-3 py-2 ${errors.zipCode && touched.zipCode ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  value={formData.zipCode}
                  onChange={handleChange}
                  onBlur={() => handleBlur("zipCode")}
                  required
                />
                {errors.zipCode && touched.zipCode && (
                  <p className="text-red-500 text-xs mt-1">ZIP code is required</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mt-4"
            >
              Add Client
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;
