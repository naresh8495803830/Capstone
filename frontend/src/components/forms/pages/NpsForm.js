import React, { useEffect, useState } from "react";
import { TextField, Button, Select, MenuItem, InputLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Copyright from "../../dashboard/pages/Copyright";
import {
  mainListItems,
  secondaryListItems,
} from "../../dashboard/pages/listItems";
import { baseServiceUrl, npsServiceUrl } from "../../../api/url";
import { FormControl } from "@mui/material";
import { Checkbox } from "@mui/material";
import { ListItemText } from "@mui/material";
import { getMethod, postMethod } from "../../../api/common";

const defaultTheme = createTheme();
const drawerWidth = 240;

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

const NpsForm = () => {
  const [open, setOpen] = React.useState(true);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgResponse, setMsgResponse] = useState("");
  const [submission, setSubmission] = useState(false);
  const [batches, setBatches] = useState([]);
  const [batchNpsTypes, setBatchNpsTypes] = useState({});
  const generate = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resQuestionType = await getMethod(
          `${npsServiceUrl}/questiontypes`
        );
        setQuestionTypes(resQuestionType.data);
      } catch (error) {
        console.log("ERR");
      }
    };
    fetchData();
    setLoading(false);
  }, []);
  const getBatchDetails = async (type) => {
    const resBatches = await postMethod(
      `${baseServiceUrl}/batch/batches/withprograms/forType`,
      {
        type,
      }
    );
    setBatches(resBatches.data);
  };
  if (!loading) {
    console.log("quest:", questionTypes);
    console.log("batches: ", batches);
  }
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [formData, setFormData] = useState({
    npsFormName: "",
    npsFormCode: generate(),
    npsData: [
      {
        npsType: "",
        batchId: [],
      },
    ],
    attendancePercentage: "",
    assignmentSubmission: "",
    npsStartDate: "",
    npsEndDate: "",
    formStatus: "",
    questions: [
      {
        question: "",
        questionType: "",
        detractorTags: [],
        promoterTags: [],
        neutralTags: [],
      },
    ],
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleDateInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.$d,
    });
    console.log(e);
    console.log(field);
    console.log(e.$d);
  };
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };
  const handleQuestionTypeChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };
  const handleTagChange = (index, tagType, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][tagType] = value
      .split(",")
      .map((tag) => tag.trim());
    setFormData({
      ...formData,
      questions: updatedQuestions,
    });
  };
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          questionType: "",
          detractorTags: [],
          promoterTags: [],
          neutralTags: [],
        },
      ],
    });
  };

  const handleBatchNpsTypeChange = (batchId, value) => {
    setBatchNpsTypes({
      ...batchNpsTypes,
      [batchId]: value,
    });
  };

  const addMoreBatchNpsType = () => {
    setFormData({
      ...formData,
      npsData: [
        ...formData.npsData,
        {
          npsType: "",
          batchId: [],
        },
      ],
    });
  };

  const handleSubmit = async () => {
    console.log(formData);
    const res = await postMethod(`${npsServiceUrl}/npsform`, formData);
    console.log(res.data.msg);
    setMsgResponse(res.data.msg);
    setSubmission(true);
  };

  if (!submission && !loading) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
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
                NPS Form
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
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Drawer>
          {/* <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          ></Box> */}
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <div className="main">
              <TextField
                label="NPS Form Name"
                name="npsFormName"
                value={formData.npsFormName}
                onChange={handleInputChange}
                fullWidth
                className="form-field"
                sx={{ mt: 4 }}
              />
              <InputLabel sx={{ mt: 2 }}>Form Status</InputLabel>
              <Select
                className="form-field"
                value={formData.formStatus}
                label="Form Status"
                name="formStatus"
                fullWidth
                onChange={handleInputChange}
              >
                <MenuItem value={"draft"}>Draft</MenuItem>
                <MenuItem value={"publish"}>Publish</MenuItem>
                <MenuItem value={"discarded"}>Discarded</MenuItem>
              </Select>
              <TextField
                label="Attendance Percentage"
                name="attendancePercentage"
                value={formData.attendancePercentage}
                onChange={handleInputChange}
                fullWidth
                className="form-field"
                sx={{ mt: 4 }}
              />
              <TextField
                label="Assignment Submission"
                name="assignmentSubmission"
                value={formData.assignmentSubmission}
                onChange={handleInputChange}
                fullWidth
                className="form-field"
                sx={{ mt: 4 }}
              />

              {/* <TextField
              label="Start Date"
              name="npsStartDate"
              value={formData.npsStartDate}
              onChange={handleInputChange}
              fullWidth
              className="form-field"
              sx={{ mt: 2 }}
            /> */}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  name="npsStartDate"
                  value={formData.npsStartDate}
                  onChange={(e) => {
                    handleDateInputChange(e, "npsStartDate");
                  }}
                  className="form-field"
                  sx={{ mt: 3 }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  name="npsEndDate"
                  value={formData.npsEndDate}
                  onChange={(e) => {
                    handleDateInputChange(e, "npsEndDate");
                  }}
                  className="form-field"
                  sx={{ mt: 3, ml: 2 }}
                />
              </LocalizationProvider>

              {formData.questions.map((question, index) => (
                <div key={index}>
                  <TextField
                    label="Question"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    fullWidth
                    className="form-field"
                    sx={{ mt: 2 }}
                  />

                  <InputLabel sx={{ mt: 2 }}>Question Type</InputLabel>

                  <Select
                    className="form-field"
                    value={question.questionType || ""}
                    label="Question Type"
                    name="questionType"
                    fullWidth
                    onChange={(e) =>
                      handleQuestionTypeChange(
                        index,
                        "questionType",
                        e.target.value
                      )
                    }
                  >
                    {questionTypes.map((q) => {
                      return (
                        <MenuItem key={q._id} value={q._id}>
                          {q.questionTypeName}
                        </MenuItem>
                      );
                      // return console.log('Question Type', q.questionTypeName)
                    })}
                  </Select>
                  <TextField
                    label="Detractor Tags (comma-separated) [optional]"
                    value={question.detractorTags.join(", ")}
                    onChange={(e) =>
                      handleTagChange(index, "detractorTags", e.target.value)
                    }
                    fullWidth
                    className="form-field"
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Promoter Tags (comma-separated) [optional]"
                    value={question.promoterTags.join(", ")}
                    onChange={(e) =>
                      handleTagChange(index, "promoterTags", e.target.value)
                    }
                    fullWidth
                    className="form-field"
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    label="Neutral Tags (comma-separated) [optional]"
                    value={question.neutralTags.join(", ")}
                    onChange={(e) =>
                      handleTagChange(index, "neutralTags", e.target.value)
                    }
                    fullWidth
                    className="form-field"
                    sx={{ mt: 1 }}
                  />
                </div>
              ))}

              {formData.npsData.map((npsData, index) => (
                <div key={index}>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id={`npsTypeLabel-${index}`}>
                      NPS Type
                    </InputLabel>
                    <Select
                      labelId={`npsTypeLabel-${index}`}
                      id={`npsType-${index}`}
                      value={npsData.npsType}
                      label={`NPS Type ${index + 1}`}
                      onChange={(e) => {
                        getBatchDetails(e.target.value);
                        const updatedNpsData = [...formData.npsData];
                        updatedNpsData[index].npsType = e.target.value;
                        updatedNpsData[index].batchId = [];
                        setFormData({
                          ...formData,
                          npsData: updatedNpsData,
                        });
                      }}
                    >
                      <MenuItem value={"start"}>Start</MenuItem>
                      <MenuItem value={"mid"}>Mid</MenuItem>
                      <MenuItem value={"end"}>End</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id={`batchLabel-${index}`}>Batches</InputLabel>
                    <Select
                      labelId={`batchLabel-${index}`}
                      id={`batch-${index}`}
                      multiple
                      value={npsData.batchId}
                      onChange={(e) => {
                        const updatedNpsData = [...formData.npsData];
                        updatedNpsData[index].batchId = e.target.value;
                        setFormData({
                          ...formData,
                          npsData: updatedNpsData,
                        });
                      }}
                      renderValue={(selected) =>
                        selected
                          .map(
                            (value) =>
                              batches.filter((item) => item._id == value)[0]
                                .batchName
                          )
                          .join(", ")
                      }
                    >
                      {batches.map((batch) => (
                        <MenuItem key={batch._id} value={batch._id}>
                          <Checkbox
                            checked={npsData.batchId.indexOf(batch._id) > -1}
                          />
                          <ListItemText primary={batch.batchName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              ))}

              <Box>
                <Button
                  onClick={addQuestion}
                  variant="contained"
                  className="form-button"
                  sx={{ mt: 2 }}
                >
                  Add Question
                </Button>
                <Button
                  onClick={addMoreBatchNpsType}
                  variant="contained"
                  className="form-button"
                  sx={{ mt: 2 }}
                >
                  Add more Batch
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  className="form-button"
                  sx={{ mt: 2, ml: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </div>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </ThemeProvider>
    );
  } else {
    return <>{msgResponse}</>;
  }
};

export default NpsForm;
