import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Box,
  Container,
  Typography,
  IconButton,
  Toolbar,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  CssBaseline,
  Divider,
  List,
  Badge,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import {
  mainListItems,
  secondaryListItems,
} from "../../dashboard/pages/listItems";
import { baseServiceUrl, npsServiceUrl } from "../../../api/url";
import { getMethod, postMethod } from "../../../api/common";

const drawerWidth = 240;
const defaultTheme = createTheme();

// Styled components
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const NpsRegisterForm = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [currentBatches, setCurrentBatches] = useState([]);
  const [formData, setFormData] = useState({
    formId: "",
    batchId: "",
    attendancePercentageThreshold: "",
    assignmentSubmissionThreshold: "",
  });
  const [msgResponse, setMsgResponse] = useState("");
  const [submission, setSubmission] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resForms = await getMethod(`${npsServiceUrl}/npsform`);
        console.log("resForms: ", resForms.data);
        const formsData = resForms.data.map((d) => ({
          npsFormName: d.npsFormName,
          npsFormId: d._id,
          batches: d.npsData.flatMap((nps) => nps.batchId), // Assuming npsData is an array and each has a batchId array
        }));
        setForms(formsData);
      } catch (error) {
        console.error("Error fetching forms: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleDrawer = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (value) => {
    const selectedForm = forms.find((form) => form.npsFormId === value);
    console.log(selectedForm);
    setCurrentBatches(selectedForm ? selectedForm.batches : []);
    setFormData((prev) => ({ ...prev, formId: value, batchId: "" }));
  };

  const handleSubmit = async () => {
    try {
      const response = await postMethod(
        `${npsServiceUrl}/npsresponse/npsregisterstudent`,
        formData
      );
      setMsgResponse(response.data.msg);
      setSubmission(true);
    } catch (error) {
      console.error("Error submitting form: ", error);
      setMsgResponse("Submission failed, please try again.");
    }
  };

  if (submission || loading) {
    return <>{msgResponse || "Loading..."}</>;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ marginRight: "36px", ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Enroll Student
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>{mainListItems}</List>
          <Divider sx={{ my: 1 }} />
          <List>{secondaryListItems}</List>
        </Drawer>
        <Container maxWidth="lg" sx={{ mt: 7, mb: 4 }}>
          <InputLabel sx={{ mt: 2 }}>Forms</InputLabel>
          <Select
            value={formData.formId}
            onChange={(e) => handleFormChange(e.target.value)}
            fullWidth
            displayEmpty
            inputProps={{ name: "formId", id: "formId" }}
          >
            {forms.map((form) => (
              <MenuItem key={form.npsFormId} value={form.npsFormId}>
                {form.npsFormName}
              </MenuItem>
            ))}
          </Select>
          <InputLabel sx={{ mt: 2 }}>Batches</InputLabel>
          <Select
            value={formData.batchId}
            onChange={handleInputChange}
            fullWidth
            displayEmpty
            inputProps={{ name: "batchId", id: "batchId" }}
          >
            {currentBatches.length > 0 ? (
              currentBatches.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.batchName}
                </MenuItem>
              ))
            ) : (
              // Display a disabled MenuItem when there are no batches
              <MenuItem value="not-selected" disabled>
                Please Select a Form first
              </MenuItem>
            )}
          </Select>
          <TextField
            label="Attendance Percentage Threshold"
            name="attendancePercentageThreshold"
            value={formData.attendancePercentageThreshold}
            onChange={handleInputChange}
            fullWidth
            className="form-field"
            sx={{ mt: 4 }}
          />
          <TextField
            label="Assignment Submission Threshold"
            name="assignmentSubmissionThreshold"
            value={formData.assignmentSubmissionThreshold}
            onChange={handleInputChange}
            fullWidth
            className="form-field"
            sx={{ mt: 4 }}
          />
          <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default NpsRegisterForm;
