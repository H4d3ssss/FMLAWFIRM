import React, { useState, useEffect } from "react";
import { Clock, LampCeiling, X } from "lucide-react";
import regionsData from "./data/regions.json";
import provincesData from "./data/provinces.json";
import citiesData from "./data/cities.json";
import barangaysData from "./data/barangays.json";
import axios from "axios";

const EditClientModal = ({
  showModal,
  closeModal,
  clientData,
  handleEditClient,
  getApprovedClients,
}) => {
  const [locationIds, setLocationIds] = useState({
    region: "",
    province: "",
    city: "",
  });

  const [formData, setFormData] = useState(clientData);
  const [errors, setErrors] = useState({
    first_name: false,
    last_name: false,
    not_formatted_date_of_birth: false,
    sex: false,
    contact_number: false,
    houseNumber: false,
    streetName: false,
    region: false,
    province: false,
    city: false,
    barangay: false,
    postalCode: false,
  });
  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    not_formatted_date_of_birth: false,
    sex: false,
    contact_number: false,
    houseNumber: false,
    streetName: false,
    region: false,
    province: false,
    city: false,
    barangay: false,
    postalCode: false,
  });

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let hasError = !value || value.trim() === "";
    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  const [addressParts, setAddressParts] = useState({
    houseNumber: "",
    streetName: "",
    barangay: "",
    city: "",
    province: "",
    region: "",
    postalCode: "",
  });

  // Parse address on component mount or when clientData changes
  useEffect(() => {
    if (!clientData?.address) return;

    // Parse the address string
    const addressString = clientData.address;
    const parts = addressString.split(",").map((part) => part.trim());

    // Extract the parts based on your expected format
    // Adjust these indices based on your actual address format
    setAddressParts({
      houseNumber: parts[0] || "",
      streetName: parts[1] || "",
      barangay: parts[2] || "",
      city: parts[3] || "",
      province: parts[4] || "",
      region: parts[5] || "",
      postalCode: parts[6] || "",
    });

    console.log("Address parsed:", parts);
  }, [clientData]);

  const [filteredProvinces, setFilteredProvinces] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredBarangays, setFilteredBarangays] = useState([]);
  const [client, setClient] = useState("");
  const [clientId, setClientId] = useState();
  useEffect(() => {
    const getClient = async () => {
      console.log(formData);
      try {
        const response = await axios.post(
          `http://localhost:3000/api/clients/one`,
          {
            clientId: formData.client_id,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getClient();
  }, []);

  useEffect(() => {
    if (clientData) {
      setFormData(clientData);
      const region = regionsData.find((r) => r.name === clientData.region);
      const province = provincesData.find(
        (p) => p.name === clientData.province
      );
      const city = citiesData.find((c) => c.name === clientData.city);
      setLocationIds({
        region: region?.id || "",
        province: province?.id || "",
        city: city?.id || "",
      });
    } else {
      setFormData({});
      setLocationIds({ region: "", province: "", city: "" });
    }
  }, [clientData]);

  useEffect(() => {
    console.log(clientData);
    if (locationIds.region) {
      const provinces = provincesData.filter(
        (p) => p.region_id === locationIds.region
      );
      setFilteredProvinces(provinces);
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
    }
  }, [locationIds.city, locationIds.province, locationIds.region]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle address fields - include ALL address fields
    if (
      [
        "houseNumber",
        "streetName",
        "barangay",
        "city",
        "province",
        "region",
        "postalCode",
      ].includes(name)
    ) {
      setAddressParts((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Reconstruct the full address and update formData
      const newAddressParts = {
        ...addressParts,
        [name]: value,
      };

      const fullAddress = [
        newAddressParts.houseNumber,
        newAddressParts.streetName,
        newAddressParts.barangay,
        newAddressParts.city,
        newAddressParts.province,
        newAddressParts.region,
        newAddressParts.postalCode,
      ]
        .filter(Boolean)
        .join(", ");

      setFormData((prev) => ({
        ...prev,
        address: fullAddress,
      }));
      return;
    }

    // Handle other form fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regionName =
      regionsData.find((r) => r.id === locationIds.region)?.name || "";
    const provinceName =
      provincesData.find((p) => p.id === locationIds.province)?.name || "";
    const cityName =
      citiesData.find((c) => c.id === locationIds.city)?.name || "";
    const barangayName =
      barangaysData.find((b) => b.id === formData.barangay)?.name || "";

    const fullAddress = `${formData.houseNumber}, ${formData.streetName}, ${barangayName}, ${cityName}, ${provinceName}, ${regionName}, ${formData.zipCode}`;
    const updatedClientData = {
      ...formData,
      clientId: formData.clientId, // Ensure clientId is included
      fullAddress,
    };
    console.log(updatedClientData);
    // handleEditClient(updatedClientData);

    try {
      const response = await axios.patch(
        "http://localhost:3000/api/clients/update-client1",
        updatedClientData
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    getApprovedClients();

    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
        <div className="bg-blue-400 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Edit Client</h2>
          <button onClick={closeModal} className="text-black text-xl font-bold">
            <X size={24} />
          </button>
        </div>
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
                  id="client_id"
                  name="client_id"
                  className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                  value={formData.client_id}
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
                  id="first_name"
                  name="first_name"
                  className={`border border-gray-300 rounded w-full px-3 py-2 ${errors.first_name && touched.first_name ? "border-red-500 bg-red-50" : ""}`}
                  value={formData.first_name}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("first_name", e.target.value)}
                  required
                />
                {errors.first_name && touched.first_name && (
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
                  id="last_name"
                  name="last_name"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.last_name}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("last_name", e.target.value)}
                  required
                />
                {errors.last_name && touched.last_name && (
                  <span className="text-red-500 text-sm">Last name is required.</span>
                )}
              </div>
              {/* {console.log(JSON.stringify(formData))} */}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.email}
                  required
                  disabled
                />
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
                  id="not_formatted_date_of_birth"
                  name="not_formatted_date_of_birth"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.not_formatted_date_of_birth}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("not_formatted_date_of_birth", e.target.value)}
                  required
                />
                {errors.not_formatted_date_of_birth && touched.not_formatted_date_of_birth && (
                  <span className="text-red-500 text-sm">Birth date is required.</span>
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={formData.sex}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("sex", e.target.value)}
                  required
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.sex && touched.sex && (
                  <span className="text-red-500 text-sm">Sex is required.</span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="contact_number"
                  name="contact_number"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  placeholder="+63 999-999-9999"
                  value={formData.contact_number}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("contact_number", e.target.value)}
                  required
                />
                {errors.contact_number && touched.contact_number && (
                  <span className="text-red-500 text-sm">Phone number is required.</span>
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={addressParts.houseNumber}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("houseNumber", e.target.value)}
                  required
                />
                {errors.houseNumber && touched.houseNumber && (
                  <span className="text-red-500 text-sm">House/Block No. is required.</span>
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
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={addressParts.streetName}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("streetName", e.target.value)}
                  required
                />
                {errors.streetName && touched.streetName && (
                  <span className="text-red-500 text-sm">Street name is required.</span>
                )}
              </div>

              {/* Region */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium">
                  Region
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={addressParts.region}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("region", e.target.value)}
                  required
                />
                {errors.region && touched.region && (
                  <span className="text-red-500 text-sm">Region is required.</span>
                )}
              </div>

              {/* Province */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium">
                  Province
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={addressParts.province}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("province", e.target.value)}
                  required
                />
                {errors.province && touched.province && (
                  <span className="text-red-500 text-sm">Province is required.</span>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium">
                  City/Municipality
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={addressParts.city}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("city", e.target.value)}
                  required
                />
                {errors.city && touched.city && (
                  <span className="text-red-500 text-sm">City/Municipality is required.</span>
                )}
              </div>

              {/* Barangay */}
              <div>
                <label htmlFor="barangay" className="block text-sm font-medium">
                  Barangay
                </label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={addressParts.barangay}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("barangay", e.target.value)}
                  required
                />
                {errors.barangay && touched.barangay && (
                  <span className="text-red-500 text-sm">Barangay is required.</span>
                )}
              </div>

              {/* ZIP Code */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  value={addressParts.postalCode}
                  onChange={handleChange}
                  onBlur={(e) => handleBlur("postalCode", e.target.value)}
                  required
                />
                {errors.postalCode && touched.postalCode && (
                  <span className="text-red-500 text-sm">ZIP Code is required.</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mt-4"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditClientModal;
