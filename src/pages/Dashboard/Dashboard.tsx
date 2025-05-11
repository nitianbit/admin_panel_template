"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Toolbar from "@mui/material/Toolbar"
import * as React from "react"
import Appbar from "../../components/Appbar"
import BarChart from "./BarChart"
import HealthCard from "./HealthCard"
import PieChart from "./PieChart"

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"
import PeopleIcon from "@mui/icons-material/People"
import TodayIcon from "@mui/icons-material/Today"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import { ENDPOINTS } from "../../services/api/constants"
import { doGET } from "../../utils/HttpUtils"
import AppointmentsByCompany from "./AppointmentsByCompany"
import { dashboard_default_stats,  dashboardCards } from "./constants"
import type{ DASHBOARD_STATS,} from "./constants"
import PatientsByCompany from "./PatientsByCompany"
import PatientsByDoctor from "./PatientsByDoctor"
import { useCompanyStore } from "../../services/company"
import PatientsByAge from "./PatientsByAge"
import PatientsByGender from "./PatientsByGender"
import { Typography, Divider } from "@mui/material"

const cardData = [
  {
    icon: <PeopleIcon />,
    title: "Employees",
    value: 1000,
  },
  {
    icon: <TodayIcon />,
    title: "Appointments",
    value: 80,
  },
  {
    icon: <VolunteerActivismIcon />,
    title: "Treatments",
    value: 200,
  },
  {
    icon: <CurrencyRupeeIcon />,
    title: "Income",
    value: "₹40000",
  },
]

const chartData = [{ chartName: <PieChart /> }, { chartName: <BarChart /> }]

// Define gradient colors for cards
const cardGradients = [
  "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
  "linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)",
  "linear-gradient(135deg, #43C6AC 0%, #191654 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #F5515F 0%, #A1051D 100%)",
  "linear-gradient(135deg, #52ACFF 0%, #0072FF 100%)",
]

export default function Dashboard({ companyWise = false }: { companyWise?: boolean }) {
  const [data, setData] = React.useState<DASHBOARD_STATS>(dashboard_default_stats)
  const { globalCompanyId } = useCompanyStore()

  const fetchData = async () => {
    try {
      let url = ENDPOINTS.dashboardStats

      if (globalCompanyId && companyWise) {
        url += `?company_id=${globalCompanyId}`
      }

      const response = await doGET(url.toString())
      if (response.status == 200) {
        setData(response.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [companyWise, globalCompanyId])

  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Dashboard" />

      <Box
        component="main"
        sx={{
          backgroundColor: "#f0f2f5",
          flexGrow: 1,
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />

        {/* Dashboard Header */}
        <Box
          sx={{
            background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)",
            color: "white",
            py: 4,
            px: 3,
            mb: 4,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Healthcare Dashboard
            </Typography>
            <Typography variant="subtitle1">
              Welcome to your healthcare analytics center. View and analyze patient and appointment data.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ mb: 6 }}>
          {/* Stats Cards */}
          <Grid container spacing={3}>
            {dashboardCards.map((item, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={4} xl={2}>
                <Paper
                  sx={{
                    p: 0,
                    overflow: "hidden",
                    height: 180,
                    borderRadius: 4,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                    background: cardGradients[index % cardGradients.length],
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <HealthCard icon={item.icon} title={item.title} value={data[item.value]} color="white" />
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Section Divider */}
          <Box sx={{ my: 5, display: "flex", alignItems: "center" }}>
            <Divider sx={{ flexGrow: 1, borderColor: "rgba(0,0,0,0.1)" }} />
            <Typography
              variant="h5"
              sx={{
                px: 2,
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Analytics & Insights
            </Typography>
            <Divider sx={{ flexGrow: 1, borderColor: "rgba(0,0,0,0.1)" }} />
          </Box>

          {/* Charts */}
          <Grid container spacing={3}>
            <AppointmentsByCompany companyWise={companyWise} />
            <PatientsByDoctor companyWise={companyWise} />
            <PatientsByCompany companyWise={companyWise} />
            <PatientsByAge companyWise={companyWise} />
            <PatientsByGender companyWise={companyWise} />
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
