import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/Api";

const EmailVerification = () => {
  const { accessToken } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/auth/verify-email/${accessToken}`
        );
        alert(response.data.message);
      } catch (error) {
        alert(error.response.data.message); // Show error message
      }
    };

    verifyEmail();
  }, [accessToken]);

  return (
    <div className="mt-24 text-center text-2xl">
      Please wait while we verify your email...
    </div>
  );
};

export default EmailVerification;
