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
import { useCompanyStore } from "../../services/company";
import { getAppointmentsCount, getDoctorsCount } from "./ApiCalling";
import moment from "moment";

const chartData = [
  { chartName: <PieChart /> },
  { chartName: <BarChart /> }
  //{ chartName: <OrganData /> }
];


export default function Dashboard() {
  const { globalCompanyId } = useCompanyStore();

  const [data, setData] = React.useState({
    labAppointmentToday: 0,
    labAppointmentTotal: 0,
    doctorAppointmentToday: 0,
    doctorAppointmentTotal: 0,
    doctorsToday: 0,
    doctorsTotal: 0
  });


  const [cardData, setCartData] = React.useState(
    [
      {
        icon: <PeopleIcon />,
        title: "Today's Lab Appointments",
        value: data.labAppointmentToday
      },
      {
        icon: <TodayIcon />,
        title: "Total Lab Appointments",
        value: data.labAppointmentTotal
      },
      {
        icon: <VolunteerActivismIcon />,
        title: "Today's Doctor Appointments",
        value: data.doctorAppointmentToday
      },
      {
        icon: <PeopleIcon />,
        title: "Total Doctor Appointments",
        value: data.doctorAppointmentTotal
      },
      {
        icon: <PeopleIcon />,
        title: "Doctors Joined Today",
        value: data.doctorsToday
      },
      {
        icon: <TodayIcon />,
        title: "Total Doctors",
        value: data.doctorsTotal
      }
    ]
  )

  React.useEffect(() => {
    const fetchData = async () => {
      const labAppointmentToday = await getAppointmentsCount({ filters: { companyId: globalCompanyId, type: 2, updatedAt: moment().unix() } });
      const labAppointmentTotal = await getAppointmentsCount({ filters: { companyId: globalCompanyId, type: 2 } });
      const doctorAppointmentToday = await getAppointmentsCount({ filters: { companyId: globalCompanyId, type: 1, updatedAt: moment().unix() } });
      const doctorAppointmentTotal = await getAppointmentsCount({ filters: { companyId: globalCompanyId, type: 1 } });
      const doctorsToday = await getDoctorsCount({ filters: { companyId: globalCompanyId, updatedAt: moment().unix() } });
      const doctorsTotal = await getDoctorsCount({ filters: { companyId: globalCompanyId } });

      setData({
        labAppointmentToday,
        labAppointmentTotal,
        doctorAppointmentToday,
        doctorAppointmentTotal,
        doctorsToday,
        doctorsTotal
      });
    }

    if (globalCompanyId) {
      fetchData();
    }
  }, [globalCompanyId]);

  React.useEffect(() => {
    setCartData([
      {
        icon: <PeopleIcon />,
        title: "Today's Lab Appointments",
        value: data.labAppointmentToday,
      },
      {
        icon: <TodayIcon />,
        title: "Total Lab Appointments",
        value: data.labAppointmentTotal,
      },
      {
        icon: <VolunteerActivismIcon />,
        title: "Today's Doctor Appointments",
        value: data.doctorAppointmentToday,
      },
      {
        icon: <PeopleIcon />,
        title: "Total Doctor Appointments",
        value: data.doctorAppointmentTotal,
      },
      {
        icon: <PeopleIcon />,
        title: "Doctors Joined Today",
        value: data.doctorsToday,
      },
      {
        icon: <TodayIcon />,
        title: "Total Doctors",
        value: data.doctorsTotal,
      },
    ]);
  }, [data]);

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
            {cardData.map((item, index) => (
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
            ))}

            {chartData.map((item, index) => (
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
            ))}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <LatestAppointments />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
