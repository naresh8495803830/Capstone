import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import "./login.css";
import { sendOtpText, startImprovingText, userEmailText } from "./constant";
import { handleSendOtp } from "../../../../api/auth/auth";

function EmailEnter({
  userEmail,
  handleUserEmailChange,
  errorValidation,
  validateEmail,
  setOtpSentState,
  loading,
  setLoading,
}) {
  return (
    <Box className="login-text-login-form">
      <Typography id="startImprovingText">{startImprovingText}</Typography>
      <Box className="login-form" component="form">
        <InputLabel id="userEmailLabel" htmlFor="user-email">
          {userEmailText}
        </InputLabel>
        <TextField
          className="login-form-userEmail-inputField"
          id="user-email"
          placeholder="User Email"
          variant="outlined"
          onChange={handleUserEmailChange}
          value={userEmail}
          required
          error={errorValidation}
          helperText={
            errorValidation ? "Please enter a valid email address." : ""
          }
        />

        <Button
          className="sendOtp-button"
          variant="contained"
          onClick={async () => {
            validateEmail(); // Trigger email validation
            if (!errorValidation) {
              try {
                setLoading(true);
                let { statusCode } = await handleSendOtp(userEmail);
                console.log("status code on click method", statusCode);
                if (statusCode === 200) {
                  setOtpSentState(true);
                }
              } catch (error) {
                console.error("Error sending OTP:", error);
              } finally {
                setLoading(false);
              }
            } else {
              alert("Enter a valid email");
            }
          }}
        >
          {sendOtpText}
        </Button>
      </Box>
    </Box>
  );
}

export default EmailEnter;
