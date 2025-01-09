import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HelpIcon from "@mui/icons-material/Help";
import SettingsIcon from "@mui/icons-material/Settings";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import SickIcon from "@mui/icons-material/Sick";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BusinessIcon from '@mui/icons-material/Business';
import { hasAccess } from "../utils/helper";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const primarynavList = [
  {
    link: "/dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    link: "/profile",
    label: "Doctor Profile",
    icon: <AccountCircleIcon />,
  },
  {
    link: "/doctor-list",
    label: "Doctor List",
    icon: <PeopleIcon />,
  },
  {
    link: "/laboratory-list",
    label: "Laboratory  List",
    icon: <PeopleIcon />,
  },

  {
    link: "/admin",
    label: "Admin",
    icon: <PeopleIcon />,
  },
  {
    link: "/patient-list",
    label: "Patient List",
    icon: <SickIcon />,
  },
  {
    link: "/appointments",
    label: "Appointments",
    icon: <BookOnlineIcon />,
  },
  {
    link: "/push-notification",
    label: "Push Notifications",
    icon: <CircleNotificationsIcon />,
  },
  {
    link: "/kanban",
    label: "Kanban",
    icon: <ViewKanbanIcon />,
  },
  {
    link: "/account",
    label: "Account",
    icon: <ManageAccountsIcon />,
  },
  {
    link: "/wellness-events",
    label: "Wellness ",
    icon: <CircleNotificationsIcon />,
  },
  {
    link: "/departments",
    label: "Departments",
    icon: <CircleNotificationsIcon />,
  },
  {
    link: "/services",
    label: "Services",
    icon: <CircleNotificationsIcon />,
  },
  {
    link: "/company",
    label: "Company",
    icon: <BusinessIcon />,
  },
  {
    link: "/offers",
    label: "Offers",
    icon: <CircleNotificationsIcon />,
  },
  {
    link: "/push-notification",
    label: "Push Notifications",
    icon: <CircleNotificationsIcon />,
  },

];

const secondaryNavList = [
  {
    link: "/lab-results",
    label: "Lab Results",
    icon: <ReceiptLongIcon />,
  },
  {
    link: "/medical-records",
    label: "Medical Records",
    icon: <DescriptionIcon />,
  },
  {
    link: "/prescriptions",
    label: "Prescriptions",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    link: "/plans",
    label: "Care Plans",
    icon: <AssignmentIcon />,
  },
  {
    link: "/forms",
    label: "Forms",
    icon: <DescriptionIcon />,
  },
  {
    link: "/help",
    label: "Get Help",
    icon: <HelpIcon />,
  },
  {
    link: "/settings",
    label: "Settings",
    icon: <SettingsIcon />,
  },
  {
    link: "/login",
    label: "Logout",
    icon: <LogoutIcon />,
  },
];

export const mainListItems = (userRoles: string[]) => (
  <React.Fragment>
    {primarynavList.map((data: any, index: any) => (
      hasAccess(userRoles, data.link) && (
        <Link
          key={index}
          to={data.link}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton>
            <ListItemIcon>{data.icon}</ListItemIcon>
            <ListItemText primary={data.label} />
          </ListItemButton>
        </Link>
      )
    ))}
  </React.Fragment>
);


export const secondaryListItems = (userRoles: string[]) => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    {secondaryNavList.map((data: any, index: any) => (
      hasAccess(userRoles, data.link) && (
        <Link
          key={index}
          to={data.link}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton>
            <ListItemIcon>{data.icon}</ListItemIcon>
            <ListItemText primary={data.label} />
          </ListItemButton>
        </Link>
      )
    ))}
  </React.Fragment>
);
