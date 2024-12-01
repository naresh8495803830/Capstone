import { Box, Typography, TextField, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import useOtp from "./useOtp";
import { handleSendOtp } from "../../../../api/auth/auth";
function OtpSent({
  email,
  setOtpSentState,
  userEmail,
  errorValidation,
  validateEmail,
  setLoading,
}) {
  const { handleInputOtp, otp, handleLogin } = useOtp();
  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 2,
        boxShadow: 2,
        borderRadius: "10px",
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Start Improving!!
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Change Email?</Typography>
        <Button variant="text" onClick={() => setOtpSentState(false)}>
          Go Back
        </Button>
      </Box>
      <Typography variant="body1">Email</Typography>
      <TextField
        id="filled-basic"
        aria-readonly
        label=""
        variant="filled"
        value={email}
        fullWidth
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 2,
          mb: 2,
        }}
      >
        <CheckCircleIcon sx={{ mr: 1, color: "green" }} />
        <Typography variant="body1" color="textPrimary" component="span">
          OTP Sent!!
        </Typography>
      </Box>

      <Typography variant="body1">Enter the OTP</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            id={`otp-input-${index}`}
            variant="outlined"
            margin="normal"
            type="text"
            inputProps={{
              maxLength: 1,
              style: { textAlign: "center", width: 30, height: 30 },
            }}
            value={digit}
            onChange={handleInputOtp(index)}
          />
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">Did not receive OTP?</Typography>
        <Button
          variant="text"
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
          Resend
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleLogin(email, otp);
        }}
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
}

export default OtpSent;
