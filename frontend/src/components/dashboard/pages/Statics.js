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
import FilterDrawer from "../../common/filterDrawer/filterDrawer";
import Title from "./Title";

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

export default function Statics() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stat, setStat] = useState([]);
  const [ogDataStat, setOgDataStat] = useState([]);
  const [dataStat, setDataStat] = useState([]);
  const [forms, setForms] = useState();
  const [filtersApplied, setFiltersApplied] = useState({
    month: "",
    npsType: "all",
  });
  const [filterDetails, setFilterDetails] = useState([]);
  const [filterValues, setFilterValues] = useState({
    npsFormName: null,
    npsType: null,
  });

  const updateFilters = (data, ogData = null) => {
    let obj = {
      ...filterValues,
      ...data,
    };
    setFilterValues(obj);
    let newData = applyFilters(ogData || ogDataStat, obj);
    setDataStat(newData);
  };
  const applyFilters = (data, filters) => {
    return data.filter((item) => {
      return Object.keys(filters).every((filterKey) => {
        if (
          filters?.[filterKey]?.includes("all") ||
          filters?.[filterKey]?.length == 0 ||
          filters?.[filterKey]?.includes(null) ||
          !filters?.[filterKey]
        ) {
          return true;
        } else {
          return filters[filterKey].includes(item[filterKey]);
        }
      });
    });
  };
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resStat = await getMethod(`${calServiceUrl}/stat/allstat`);
        setStat(resStat.data);
        const resDataStat = await getMethod(`${calServiceUrl}/stat/npsreport`);
        console.log('resDataStat: ', resDataStat.data)
        setDataStat(resDataStat.data);
        console.log('dataStat: ', dataStat)
        setOgDataStat(resDataStat.data);
        console.log("OgDataStat", ogDataStat);
        processFilterOptions(resDataStat.data);
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  const processFilterOptions = (data) => {
    data = data || ogDataStat;
    let processedFilters = [];
    let npsMonthItems = [...new Set(data.map((d) => d.npsFormName))].map(
      (uniqueNpsFormName) => {
        return {
          label: uniqueNpsFormName,
          value: uniqueNpsFormName,
        };
      }
    );
    processedFilters.push({
      value: filterValues["npsFormName"] || null,
      items: npsMonthItems,
      name: "Nps Month",
      key: "npsFormName",
      multiSelect: false,
    });
    processedFilters.push({
      value: filterValues["npsType"] || null,
      items: [
        { label: "Start", value: "start" },
        { label: "Mid", value: "mid" },
        { label: "End", value: "end" },
      ],
      name: "Nps Type",
      key: "npsType",
      multiSelect: false,
    });
    setFilterDetails(processedFilters);
    updateFilters(
      {
        // npsFormName: [npsMonthItems[0]?.value],
        npsFormName: [],
      },
      data
    );
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };
  if (!loading) {
    console.log("Data Loaded");
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
                Statics
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
                {/* <Grid item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 150,
                    }}
                  >
                    <NPSstatCard title="Active NPS" data={programCount} name="Program" link="/program"/>
                  </Paper>
                </Grid> */}
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
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Title>{"Overall Stats"}</Title>
                      {filterDetails?.length > 0 && (
                        <FilterDrawer
                          openFilters={processFilterOptions}
                          filterDetails={filterDetails}
                          updateFilters={updateFilters}
                        />
                      )}
                    </div>
                    <NpsOrders data={dataStat} />
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
