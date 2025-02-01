import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import OrganData from "./OrganData";
import HealthCard from "./HealthCard";
import LatestAppointments from "./LatestAppointments";
import Appbar from "../../components/Appbar";

import PeopleIcon from "@mui/icons-material/People";
import TodayIcon from "@mui/icons-material/Today";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { doGET } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";
import { dashboard_default_stats, DASHBOARD_STATS, dashboardCards } from "./constants";
import PatientsByCompany from "./PatientsByCompany";
import PatientsByDoctor from "./PatientsByDoctor";
import AppointmentsByCompany from "./AppointmentsByCompany";

const cardData = [
  {
    icon: <PeopleIcon />,
    title: "Patients",
    value: 1000
  },
  {
    icon: <TodayIcon />,
    title: "Appointments",
    value: 80
  },
  {
    icon: <VolunteerActivismIcon />,
    title: "Treatments",
    value: 200
  },
  {
    icon: <CurrencyRupeeIcon />,
    title: "Income",
    value: "₹40000"
  }
];

const chartData = [
  { chartName: <PieChart /> },
  { chartName: <BarChart /> }
];

export default function Dashboard() {
  const [data, setData] = React.useState<DASHBOARD_STATS>(dashboard_default_stats);

  const fetchData = async () => {
    try {
      const response = await doGET(`${ENDPOINTS.dashboardStats}`);
      if (response.status == 200) {
        setData(response.data?.data)
      }
    } catch (error) {

    }
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Dashboard" />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto"
        }}
      >
        <Toolbar />

        <Container sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* {cardData.map((item, index) => (
              <Grid key={index} item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 200
                  }}
                >
                  <HealthCard
                    icon={item.icon}
                    title={item.title}
                    value={item.value}
                  />
                </Paper>
              </Grid>
            ))} */}
            {
              dashboardCards.map((item, index) => (
                <Grid key={index} item xs={12} md={4} lg={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 200
                    }}
                  >
                    <HealthCard
                      icon={item.icon}
                      title={item.title}
                      value={data[item.value]}
                    />
                  </Paper>
                </Grid>
              ))
            }


            {/* Chart */}
            {/* {chartData.map((item, index) => (
              <Grid key={index} item xs={12} md={6} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400
                  }}
                >
                  {item.chartName}
                </Paper>
              </Grid>
            ))} */}
            {/* <img src="https://echarts.apache.org/examples/data/asset/geo/Veins_Medical_Diagram_clip_art.svg" /> */}
            {/* <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <LatestAppointments />
              </Paper>
            </Grid> */}
          </Grid>
          <Grid container spacing={3} marginTop={1}>
            <AppointmentsByCompany />
            <PatientsByDoctor />
            <PatientsByCompany />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
