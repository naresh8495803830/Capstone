import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NpsForm from "../../forms/pages/NpsForm";
import { useAuth } from "../../../hooks/useAuth";
import Cookies from "js-cookie";
export const mainListItems = (
  <React.Fragment>
    <ListItemButton href="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton href="/npsform">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Create NPS" />
    </ListItemButton>
    <ListItemButton href="/users">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Add Student" />
    </ListItemButton>
    <ListItemButton href="/npsresult">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="All NPS" />
    </ListItemButton>
    <ListItemButton href="/statics">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="NPS Stats" />
    </ListItemButton>
    <ListItemButton href="/npsregisterform">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Student Enrollment" />
    </ListItemButton>
    <ListItemButton href="/batchwise">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Analysis" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Others
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText
        onClick={() => {
          Cookies.remove("token");
          localStorage.clear();
          window.location.href = "/";
        }}
        primary="Logout"
      />
    </ListItemButton>
  </React.Fragment>
);
