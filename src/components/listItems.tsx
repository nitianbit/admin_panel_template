import * as React from "react";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

// Professional Colorful Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import BadgeIcon from "@mui/icons-material/Badge";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import BiotechIcon from "@mui/icons-material/Biotech";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CampaignIcon from "@mui/icons-material/Campaign";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupsIcon from "@mui/icons-material/Groups";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SummarizeIcon from "@mui/icons-material/Summarize";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SpaIcon from "@mui/icons-material/Spa";
import DomainIcon from "@mui/icons-material/Domain";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BusinessIcon from '@mui/icons-material/Business';
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SnippetFolderIcon from "@mui/icons-material/SnippetFolder";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CollectionsIcon from "@mui/icons-material/Collections";
import EventIcon from "@mui/icons-material/Event";
import HealingIcon from "@mui/icons-material/Healing";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalMallIcon from "@mui/icons-material/LocalMall";

// Secondary List Icons
import ScienceIcon from "@mui/icons-material/Science";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import MedicationIcon from "@mui/icons-material/Medication";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import LogoutIcon from "@mui/icons-material/Logout";

import { hasAccess } from "../utils/helper";

const primarynavList = [
  {
    link: "/dashboard",
    label: "Dashboard",
    icon: <DashboardIcon sx={{ color: "#4caf50" }} />, // Green
  },
  {
    link: "/stats",
    label: "Stats",
    icon: <BarChartIcon sx={{ color: "#2196f3" }} />, // Blue
  },
  {
    link: "/profile",
    label: "Doctor Profile",
    icon: <BadgeIcon sx={{ color: "#9c27b0" }} />, // Purple
  },
  {
    link: "/doctor-list",
    label: "Doctor List",
    icon: <MedicalServicesIcon sx={{ color: "#009688" }} />, // Teal
  },
  {
    link: "/laboratory-list",
    label: "Laboratory List",
    icon: <BiotechIcon sx={{ color: "#ff9800" }} />, // Orange
  },
  {
    link: "/hr-list",
    label: "HR",
    icon: <SupervisedUserCircleIcon sx={{ color: "#795548" }} />, // Brown
  },
  {
    link: "/marketing",
    label: "Marketing",
    icon: <CampaignIcon sx={{ color: "#e91e63" }} />, // Pink
  },
  {
    link: "/admin",
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ color: "#f44336" }} />, // Red
  },
  {
    link: "/patient-list",
    label: "Employee List",
    icon: <GroupsIcon sx={{ color: "#3f51b5" }} />, // Indigo
  },
  {
    link: "/appointments",
    label: "Appointments",
    icon: <EventAvailableIcon sx={{ color: "#8bc34a" }} />, // Light Green
  },
  {
    link: "/report",
    label: "Report/Prescription",
    icon: <SummarizeIcon sx={{ color: "#00bcd4" }} />, // Cyan
  },
  {
    link: "/push-notification",
    label: "Push Notifications",
    icon: <NotificationsActiveIcon sx={{ color: "#ffc107" }} />, // Amber
  },
  {
    link: "/kanban",
    label: "Kanban",
    icon: <ViewKanbanIcon sx={{ color: "#673ab7" }} />, // Deep Purple
  },
  {
    link: "/account",
    label: "Account",
    icon: <ManageAccountsIcon sx={{ color: "#607d8b" }} />, // Blue Grey
  },
  {
    link: "/wellness-events",
    label: "Wellness",
    icon: <SpaIcon sx={{ color: "#4caf50" }} />, // Green
  },
  {
    link: "/departments",
    label: "Departments",
    icon: <DomainIcon sx={{ color: "#ff5722" }} />, // Deep Orange
  },
  {
    link: "/services",
    label: "Services",
    icon: <MonitorHeartIcon sx={{ color: "#2196f3" }} />, // Blue
  },
  {
    link: "/company",
    label: "Company",
    icon: <BusinessIcon sx={{ color: "#3f51b5" }} />, // Indigo
  },
  {
    link: "/offers",
    label: "Offers",
    icon: <LocalOfferIcon sx={{ color: "#e91e63" }} />, // Pink
  },
  {
    link: "/service-images",
    label: "Service Images",
    icon: <PhotoLibraryIcon sx={{ color: "#9c27b0" }} />, // Purple
  },
  {
    link: "/packages",
    label: "Packages",
    icon: <Inventory2Icon sx={{ color: "#ff9800" }} />, // Orange
  },
  {
    link: "/forms",
    label: "Forms",
    icon: <SnippetFolderIcon sx={{ color: "#009688" }} />, // Teal
  },
  {
    link: "/blogs",
    label: "Blogs",
    icon: <RssFeedIcon sx={{ color: "#ff5722" }} />, // Deep Orange
  },
  {
    link: "/superblogs",
    label: "SuperBlogs",
    icon: <AutoStoriesIcon sx={{ color: "#673ab7" }} />, // Deep Purple
  },
  {
    link: "/external-packages",
    label: "External Packages",
    icon: <CardGiftcardIcon sx={{ color: "#e91e63" }} />, // Pink
  },
  {
    link: "/vendors",
    label: "Vendors",
    icon: <StorefrontIcon sx={{ color: "#795548" }} />, // Brown
  },
  {
    link: "/company-external-packages",
    label: "Vendor Company",
    icon: <ApartmentIcon sx={{ color: "#607d8b" }} />, // Blue Grey
  },
  {
    link: "/gallery-images",
    label: "Gallery Images",
    icon: <CollectionsIcon sx={{ color: "#f44336" }} />, // Red
  },
  {
    link: "/event",
    label: "Events",
    icon: <EventIcon sx={{ color: "#8bc34a" }} />, // Light Green
  },
  {
    link: "/second-opinion",
    label: "Second Opinion",
    icon: <HealingIcon sx={{ color: "#00bcd4" }} />, // Cyan
  },
  {
    link: "/corporate-plan",
    label: "Corporate Plan",
    icon: <WorkIcon sx={{ color: "#3f51b5" }} />, // Indigo
  },
  {
    link: "/surgery",
    label: "Surgery",
    icon: <LocalHospitalIcon sx={{ color: "#f44336" }} />, // Red
  },
  {
    link: "/ewa-package",
    label: "Ewa Package",
    icon: <LocalMallIcon sx={{ color: "#ffc107" }} />, // Amber
  },
];

const secondaryNavList = [
  {
    link: "/lab-results",
    label: "Lab Results",
    icon: <ScienceIcon sx={{ color: "#00bcd4" }} />, // Cyan
  },
  {
    link: "/medical-records",
    label: "Medical Records",
    icon: <FolderSharedIcon sx={{ color: "#ff9800" }} />, // Orange
  },
  {
    link: "/prescriptions",
    label: "Prescriptions",
    icon: <MedicationIcon sx={{ color: "#e91e63" }} />, // Pink
  },
  {
    link: "/plans",
    label: "Care Plans",
    icon: <FactCheckIcon sx={{ color: "#4caf50" }} />, // Green
  },
  {
    link: "/forms",
    label: "Forms",
    icon: <DynamicFormIcon sx={{ color: "#673ab7" }} />, // Deep Purple
  },
  {
    link: "/help",
    label: "Get Help",
    icon: <SupportAgentIcon sx={{ color: "#2196f3" }} />, // Blue
  },
  {
    link: "/settings",
    label: "Settings",
    icon: <SettingsSuggestIcon sx={{ color: "#607d8b" }} />, // Blue Grey
  },
  {
    link: "/login",
    label: "Logout",
    icon: <LogoutIcon sx={{ color: "#f44336" }} />, // Red
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
