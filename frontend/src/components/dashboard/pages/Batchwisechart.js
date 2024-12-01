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
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import Chart from "./Chart";
import NPSstatCard from "./NPSstatCard";
import Orders from "./Orders";
import BatchWiseNpsOrders from "./Batchwisenpsdata";
import Copyright from "./Copyright";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  baseServiceUrl,
  userServiceUrl,
  calServiceUrl,
} from "../../../api/url";
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

export default function Batchwisechart() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  //   const [stat, setStat] = useState([]);
  const [dataStat, setDataStat] = useState([]);
  const [forms, setForms] = useState();
  const handleChange = (event) => {
    setForms(event.target.value);
  };

  const syncBatchData = async () => {
    setLoading(true);
      try {
        const resStat = await getMethod(`${calServiceUrl}/stat/syncbatchprogram`);
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const resStat = await getMethod(`${calServiceUrl}/stat/syncbatchprogram`);
        // setDataStat(resStat.data);
        const resCStat = await getMethod(`${calServiceUrl}/stat/batchprogram`);
        console.log('rsCStat: ', resCStat.data)
        setDataStat(resCStat.data);
        // setDataStat(resStat.data);
        // const resDataStat = await axios.get(`${calServiceUrl}/stat/npsreport`);
        // setDataStat(resDataStat.data);
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  if (!loading) {
    console.log("Data Loaded");
    console.log(dataStat);
  }

  if (loading) {
    return (
      <div className="App">
        <img src={loadingSpinner} alt="Loading..." />
      </div>
    );
  } else {
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
                Analysis
              </Typography>
              <IconButton color="inherit">
                <button onClick={syncBatchData}>Sync Batch</button>
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
                {/* <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 150,
                    }}
                  >
                    <NPSstatCard
                      title="NPS Response"
                      data={
                        Math.round(
                          (stat.totalCompletedResponse /
                            stat.totalNPSResponse) *
                            100
                        ) + "%"
                      }
                      name="Domain"
                      link="/domain"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 150,
                    }}
                  >
                    <NPSstatCard
                      title="Satisfaction Score"
                      data={stat.satisfactionRate}
                      name="Batch"
                      link="/batch"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 150,
                    }}
                  >
                    <NPSstatCard
                      title="Total Promoters"
                      data={stat.totalPromoter}
                      name="Batch"
                      link="/batch"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 150,
                    }}
                  >
                    <NPSstatCard
                      title="Total Detractor"
                      data={stat.totalDetractor}
                      name="Batch"
                      link="/batch"
                    />
                  </Paper>
                </Grid> */}

                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <BatchWiseNpsOrders
                      title="Batch Wise Stats"
                      data={dataStat.data}
                      // npsForms={dataStat.npsForms}
                    />
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}
