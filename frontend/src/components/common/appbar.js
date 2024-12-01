import { Box } from "@mui/material";
import "./appbar.css";

function AppBar() {
  return (
    <>
      <Box className="app-bar-section">
        <img
          className="app-bar-herovired-logo-img"
          src="https://herovired.com/assets/img/footer.png"
        ></img>
      </Box>
    </>
  );
}

export default AppBar;
