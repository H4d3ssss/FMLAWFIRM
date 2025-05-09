import React, { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import axios from "axios";

const ActiveCaseCard = ({ caseCount }) => {
  // const [caseCount, setCaseCount] = useState(0);

  // const getActiveCasesCount = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:3000/api/cases/active-cases-count"
  //     );
  //     setCaseCount(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getActiveCasesCount();
  // }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center w-full h-full min-h-[180px]">
      <div className="flex items-center space-x-2 mb-4">
        <Briefcase className="w-10 h-10 text-yellow-600" />
        <h2 className="text-xl font-bold text-gray-800">Active Cases</h2>
      </div>
      <p className="text-3xl font-semibold text-yellow-600">{caseCount}</p>
    </div>
  );
};

export default ActiveCaseCard;
