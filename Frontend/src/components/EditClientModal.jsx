import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import regionsData from './data/regions.json';
import provincesData from './data/provinces.json';
import citiesData from './data/cities.json';
import barangaysData from './data/barangays.json';

const EditClientModal = ({ showModal, closeModal, clientData, handleEditClient }) => {
    const [formData, setFormData] = useState(clientData);
    const [locationIds, setLocationIds] = useState({
        region: '',
        province: '',
        city: '',
    });

    const [filteredProvinces, setFilteredProvinces] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [filteredBarangays, setFilteredBarangays] = useState([]);

    useEffect(() => {
        if (clientData) {
            setFormData(clientData);
            const region = regionsData.find((r) => r.name === clientData.region);
            const province = provincesData.find((p) => p.name === clientData.province);
            const city = citiesData.find((c) => c.name === clientData.city);
            setLocationIds({
                region: region?.id || '',
                province: province?.id || '',
                city: city?.id || '',
            });
        } else {
            setFormData({});
            setLocationIds({ region: '', province: '', city: '' });
        }
    }, [clientData]);

    useEffect(() => {
        if (locationIds.region) {
            const provinces = provincesData.filter((p) => p.region_id === locationIds.region);
            setFilteredProvinces(provinces);
        }
    }, [locationIds.region]);

    useEffect(() => {
        if (locationIds.province) {
            const cities = citiesData.filter(
                (c) => c.province_id === locationIds.province && c.region_id === locationIds.region
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

        if (['region', 'province', 'city', 'barangay'].includes(name)) {
            setLocationIds((prev) => ({ ...prev, [name]: value }));
            setFormData((prev) => ({ ...prev, [name]: value }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const regionName = regionsData.find((r) => r.id === locationIds.region)?.name || '';
        const provinceName = provincesData.find((p) => p.id === locationIds.province)?.name || '';
        const cityName = citiesData.find((c) => c.id === locationIds.city)?.name || '';
        const barangayName = barangaysData.find((b) => b.id === formData.barangay)?.name || '';

        const fullAddress = `${formData.houseNumber}, ${formData.streetName}, ${barangayName}, ${cityName}, ${provinceName}, ${regionName}, ${formData.zipCode}`;
        const updatedClientData = {
            ...formData,
            clientId: formData.clientId, // Ensure clientId is included
            fullAddress,
        };

        handleEditClient(updatedClientData);
        closeModal();
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
                <div className="bg-yellow-400 p-4 rounded-t-lg flex justify-between items-center">
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
                                    id="clientId"
                                    name="clientId"
                                    className="border border-gray-300 rounded w-full px-3 py-2 bg-gray-100"
                                    value={formData.clientId}
                                    readOnly
                                />
                            </div>

                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
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
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
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
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Birth Date */}
                            <div>
                                <label htmlFor="birthDate" className="block text-sm font-medium">
                                    Birth Date
                                </label>
                                <input
                                    type="date"
                                    id="birthDate"
                                    name="birthDate"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    required
                                />
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
                                    required
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
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
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    placeholder="+63 999-999-9999"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* House/Block No. */}
                            <div>
                                <label htmlFor="houseNumber" className="block text-sm font-medium">
                                    House/Block No.
                                </label>
                                <input
                                    type="text"
                                    id="houseNumber"
                                    name="houseNumber"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.houseNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Street Name */}
                            <div>
                                <label htmlFor="streetName" className="block text-sm font-medium">
                                    Street Name
                                </label>
                                <input
                                    type="text"
                                    id="streetName"
                                    name="streetName"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.streetName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Region */}
                            <div>
                                <label htmlFor="region" className="block text-sm font-medium">
                                    Region
                                </label>
                                <select
                                    id="region"
                                    name="region"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={locationIds.region}
                                    onChange={handleChange}
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

                            {/* Province */}
                            <div>
                                <label htmlFor="province" className="block text-sm font-medium">
                                    Province
                                </label>
                                <select
                                    id="province"
                                    name="province"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={locationIds.province}
                                    onChange={handleChange}
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

                            {/* City */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium">
                                    City/Municipality
                                </label>
                                <select
                                    id="city"
                                    name="city"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={locationIds.city}
                                    onChange={handleChange}
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

                            {/* Barangay */}
                            <div>
                                <label htmlFor="barangay" className="block text-sm font-medium">
                                    Barangay
                                </label>
                                <select
                                    id="barangay"
                                    name="barangay"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.barangay}
                                    onChange={handleChange}
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

                            {/* ZIP Code */}
                            <div>
                                <label htmlFor="zipCode" className="block text-sm font-medium">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                />
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
