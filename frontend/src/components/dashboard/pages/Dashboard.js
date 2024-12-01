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
import Cookies from "js-cookie";
import { useCookies } from 'react-cookie';


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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [domainCount, setDomainCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [batchCount, setBatchCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataStat, setDataStat] = useState([]);
  const [cookies, setCookie] = useCookies(['token']);

  const syncData = async () => {
    setLoading(true);
    try{
      const syncDataStat = await getMethod(`${calServiceUrl}/stat/allreport`);
    }catch(error){
      console.log(error.message);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cachedDomainCount = localStorage.getItem("domainCount");
        const cachedProgramCount = localStorage.getItem("programCount");
        const cachedBatchCount = localStorage.getItem("batchCount");
        const cachedUserCount = localStorage.getItem("userCount");
  
        if (cachedDomainCount && cachedProgramCount && cachedBatchCount && cachedUserCount) {
          setDomainCount(parseInt(cachedDomainCount, 10));
          setProgramCount(parseInt(cachedProgramCount, 10));
          setBatchCount(parseInt(cachedBatchCount, 10));
          setUserCount(parseInt(cachedUserCount, 10));
        } else {
          const resDomain = await getMethod(`${baseServiceUrl}/domain`);
          const domainCount = resDomain.data.length;
          setDomainCount(domainCount);
          localStorage.setItem("domainCount", domainCount);
  
          const resProgram = await getMethod(`${baseServiceUrl}/program`);
          const programCount = resProgram.data.length;
          setProgramCount(programCount);
          localStorage.setItem("programCount", programCount);
  
          const resBatch = await getMethod(`${baseServiceUrl}/batch`);
          const batchCount = resBatch.data.length;
          setBatchCount(batchCount);
          localStorage.setItem("batchCount", batchCount);
  
          const resUser = await getMethod(`${userServiceUrl}/student`);
          const userCount = resUser.data.length;
          setUserCount(userCount);
          localStorage.setItem("userCount", userCount);
        }
  
        const resDataStat = await getMethod(`${calServiceUrl}/stat/npsreport`);
        setDataStat(resDataStat.data);
  
        setCookie('token', Cookies.get("token"), { 
          path: '/',
          domain: '.herovired.com' 
        });
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
    console.log(domainCount, programCount, batchCount);
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
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <button onClick={syncData}>Sync</button>
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
                <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 150,
                    }}
                  >
                    <Deposits
                      title="Total Programs"
                      data={programCount}
                      name="Program"
                      link="/program"
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
                    <Deposits
                      title="Total Domains"
                      data={domainCount}
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
                    <Deposits
                      title="Total Batches"
                      data={batchCount}
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
                    <Deposits
                      title="Total Users"
                      data={userCount}
                      name="Users"
                      link="/users"
                      viewlink="/studentlist"
                    />
                  </Paper>
                </Grid>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <NpsOrders title="Current Ongoing NPS" data={dataStat} />
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
