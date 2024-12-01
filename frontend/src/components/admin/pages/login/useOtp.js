import { useState } from "react";
import { handleVerifyOtp } from "../../../../api/auth/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";

function useOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { setToken } = useAuth();
  const handleInputOtp = (index) => (event) => {
    const value = event.target.value;

    // Check if the input is a digit or backspace
    if (/^\d*$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      console.log("OTP: ", newOtp);

      setOtp(newOtp);

      if (value === "" && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      } else if (value === "" && index === 0) {
        document.getElementById(`otp-input-${index}`).focus();
      } else if (index < otp.length - 1 && value.length === 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleLogin = async (email, otp) => {
    console.log("handleLogin clicked", email, otp);
    try {
      const { statusCode, token } = await handleVerifyOtp(email, otp);
      if (statusCode === 200) {
        if (token) {
          setToken(token);
          localStorage.setItem("token", token); 
        }
        console.log("login successfully");
        navigate("/dashboard");
      } else if (statusCode === 401) {
        console.log("Invalid OTP or OTP already verified");
      }
    } catch (error) {
      console.log("Error while Login", error);
    }
  };
  return {
    handleInputOtp,
    handleLogin,
    otp,
  };
}

export default useOtp;
