import * as React from "react";
import { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import Chart from "./Chart";
import Deposits from "./Deposits";
import NpsOrders from "./NpsOrders";
import Copyright from "./Copyright";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { npsServiceUrl } from "../../../api/url";
import loadingSpinner from "../../../loading.gif";
import "../../../App.css";
import { getMethod } from "../../../api/common";

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

const defaultTheme = createTheme();

export default function UserResponse() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataStat, setDataStat] = useState([]);
  const { responseId } = useParams();
  const [npsVal, setNpsVal] = useState(0);
  const [csatVal, setCsatVal] = useState(0);
  console.log("response id: ", responseId);
  console.log(`${npsServiceUrl}/npsresponse/nps/res/${responseId}`);

  useEffect(() => {
    console.log("Hey");
    const fetchData = async () => {
      setLoading(true);
      console.log(npsServiceUrl);
      console.log(`${npsServiceUrl}/npsresponse/nps/res/${responseId}`);
      try {
        const resDataStat = await getMethod(
          `${npsServiceUrl}/npsresponse/nps/res/${responseId}`
        );
        setDataStat(resDataStat.data);
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, [responseId]);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  if (loading) {
    console.log("Data Loaded");
    return <>Loading...</>;
  }

  //   if (loading) {
  //     return (
  //       <div className="App">
  //         <img src={loadingSpinner} alt="Loading..." />
  //       </div>
  //     );
  //   }
  else {
    console.log("Value of data: ", dataStat);
    console.log("Loading: ", loading);
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
                User Response
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
          <Box
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
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {/* Chart */}
                {/* <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 240,
                    }}
                  >
                    <Chart />
                  </Paper>
                </Grid> */}
                {/* Recent Deposits */}

                <Grid item xs={12} md={12} lg={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 150,
                    }}
                  >
                    Name: {dataStat.name}
                    <br></br>
                    Phone no.: {dataStat.phoneNo}
                    <br></br>
                    Email: {dataStat.email}
                    <br></br>
                    Status: {dataStat.completionStatus} <br></br>
                    Form Code: {dataStat.npsFormCode} <br></br>
                    {/* NPS: {npsVal} */}
                  </Paper>
                </Grid>
                {/* Recent Orders */}
                {dataStat.questions.map((q) => {
                  // if(q.questionType == '658ef33741e4685499711da6'){
                  //     setNpsVal(q.responseVal)
                  // }
                  return (
                    <Grid item xs={12} md={12} lg={12}>
                      <Paper
                        sx={{ p: 2, display: "flex", flexDirection: "column" }}
                      >
                        Question: {q.question}
                        <br></br>
                        Response: {q.responseVal}
                        <br></br>
                        Comment: {q.responseComment}
                        <br></br>
                        Type: {q.responseTagType}
                        <br></br>
                        Tags:
                        {q.responseTag.map((d) => {
                          return <>{d},</>;
                        })}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}
