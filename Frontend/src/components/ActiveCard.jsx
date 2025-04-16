import React, { useEffect, useState } from "react";
import { FaBriefcase } from "react-icons/fa"; // Icon for the card
import axios from "axios"; // For API requests

const ActiveCard = () => {
    const [activeCases, setActiveCases] = useState(0); // State to store the count
    const [loading, setLoading] = useState(true); // State to handle loading

    useEffect(() => {
        // Fetch the count of active cases from the backend
        const fetchActiveCases = async () => {
            try {
                const response = await axios.get("/api/active-cases-count");
                setActiveCases(response.data.count);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching active cases count:", error);
                setLoading(false);
            }
        };

        fetchActiveCases();
    }, []);

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center justify-center w-48 h-48">
            <div className="text-4xl text-gray-700 mb-4">
                <FaBriefcase />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Active Cases</h3>
            {loading ? (
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
            ) : (
                <p className="text-2xl font-bold text-black mt-2">{activeCases}</p>
            )}
        </div>
    );
};

export default ActiveCard;