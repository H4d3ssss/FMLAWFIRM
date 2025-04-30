import React, { use, useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import axios from "axios";
const ActiveCaseCard = () => {
  const [caseCount, setCaseCount] = useState(0);
  const getActiveCasesCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/cases/active-cases-count"
      );
      console.log(response.data);
      setCaseCount(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getActiveCasesCount();
  });

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center justify-center w-full h-[200px] sm:w-[250px] sm:h-[220px] md:w-[300px] md:h-[250px]">
      <div className="flex items-center space-x-2 mb-2">
        <Briefcase className="w-8 h-8 text-yellow-600 sm:w-10 sm:h-10 md:w-12 md:h-12" />
        <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
          Active Cases
        </h2>
      </div>
      <p className="text-2xl font-semibold text-yellow-600 sm:text-3xl md:text-4xl">
        {caseCount}
      </p>
    </div>
  );
};

export default ActiveCaseCard;
