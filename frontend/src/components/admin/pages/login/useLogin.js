import { useState } from "react";

function useLogin() {
  const [userEmail, setUserEmail] = useState("");
  const [errorValidation, setErrorValidation] = useState(false);
  const [otpSentState , setOtpSentState] = useState(false)
  const [loading, setLoading] = useState(false);

  function handleUserEmailChange(event) {
    setUserEmail(event.target.value);
  }
  function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(userEmail);
    setErrorValidation(!isValidEmail);
 
  }

  return {
    userEmail,
    handleUserEmailChange,
    errorValidation,
    validateEmail, // Expose the validateEmail function
    otpSentState,
    setOtpSentState,
    loading,
    setLoading
  };
}

export default useLogin;
