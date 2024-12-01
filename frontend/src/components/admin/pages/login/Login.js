import { Box, Typography } from "@mui/material";
import AppBar from "../../../common/appbar";
import useLogin from "./useLogin";
import EmailEnter from "./emailEnter";
import { textBoxContent } from "./constant";
import "./login.css";
import OtpSent from "./otpSent";
import Loading from "../../../common/loading/Loading";

function Login() {
  const {
    userEmail,
    handleUserEmailChange,
    errorValidation,
    validateEmail,
    otpSentState,
    setOtpSentState,
    loading,
    setLoading
  } = useLogin();

  return (
    <>
      <Box className="main-section">
        <AppBar />
        <Box className="login-section">
          <Box className="login-left-section">
            <Box className="login-left-section-text-box">
              <Typography>{textBoxContent}</Typography>
            </Box>
          </Box>
          <Box className="login-right-section">
            {loading ? (
              <Loading />
            ) : otpSentState ? (
              <OtpSent
                email={userEmail}
                setOtpSentState={setOtpSentState}
                userEmail={userEmail}
                errorValidation={errorValidation}
                validateEmail={validateEmail}
                setLoading={setLoading}
              />
            ) : (
              <EmailEnter
                userEmail={userEmail}
                handleUserEmailChange={handleUserEmailChange}
                errorValidation={errorValidation}
                validateEmail={validateEmail}
                setOtpSentState={setOtpSentState}
                setLoading={setLoading}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Login;
