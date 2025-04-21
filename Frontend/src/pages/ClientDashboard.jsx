import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ClientDashboard = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/authenticate-user"
        );

        console.log(response.data);
        if (response.data.role === "Lawyer") {
          navigate("/admindashboard");
        } else if (response.data.role === "Client") {
          navigate("/clientdashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
        console.log(error);
      }
    };
    authenticateUser();
  }, []);
  return <div>ClientDashboard</div>;
};

export default ClientDashboard;
