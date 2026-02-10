import * as React from "react";
import Paper from "@mui/material/Paper";
import Appbar from "../../components/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Avatar, Typography, Grid, Box, Stack, Divider, useTheme } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LatestAppointments from "../Dashboard/LatestAppointments";
import PieChart from "./PieChart";
import { useAppContext } from "../../services/context/AppContext";

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string | number, color: string }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      height: "100%",
      borderRadius: 4,
      border: "1px solid",
      borderColor: "divider",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
      },
    }}
  >
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        backgroundColor: `${color}15`, // 15% opacity hex
        color: color,
        display: "flex",
        mr: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold" color="text.primary">
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default function Profile() {
  const { userData } = useAppContext();
  const theme = useTheme();

  // Loading state
  if (!userData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading Profile...</Typography>
      </Box>
    );
  }

  const { avatarUrl, name, specialization, biography, email, contactNo, patients, experience } = userData;

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Appbar appBarTitle="Profile" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Left Column: Profile Identity & Contact */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  mb: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {/* Banner */}
                <Box
                  sx={{
                    height: 140,
                    background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
                  }}
                />

                {/* Avatar & Basic Info */}
                <Box
                  sx={{
                    px: 3,
                    pb: 4,
                    mt: -7,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={avatarUrl || "https://i.pravatar.cc/300"}
                    alt={name}
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid white",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    {name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    fontWeight={500}
                    align="center"
                    sx={{
                      bgcolor: "primary.lighter",
                      px: 2,
                      py: 0.5,
                      borderRadius: 10,
                      fontSize: "0.9rem",
                    }}
                  >
                    {specialization || "Doctor"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Stats, Bio, etc. */}
            <Grid item xs={12} md={8} lg={9}>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<PeopleIcon fontSize="large" />}
                    title="Successful Patients"
                    value={patients || "0"}
                    color={theme.palette.success.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard
                    icon={<MedicalServicesIcon fontSize="large" />}
                    title="Years of Experience"
                    value={`${experience || "0"} Years`}
                    color={theme.palette.info.main}
                  />
                </Grid>

                {/* Biography */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      About Me
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {biography || "No biography available for this profile. Please add some details to help patients know you better."}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Contact Information (Moved from Left Column) */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>
                      Contact Information
                    </Typography>

                    <Stack spacing={2} direction="row" flexWrap="wrap" gap={3}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{
                          minWidth: 40, height: 40, borderRadius: "50%",
                          bgcolor: "primary.lighter", display: "flex",
                          alignItems: "center", justifyContent: "center", mr: 2
                        }}>
                          <EmailIcon color="primary" fontSize="small" />
                        </Box>
                        <Box sx={{ overflow: "hidden" }}>
                          <Typography variant="caption" color="text.secondary" display="block">Email Address</Typography>
                          <Typography variant="body2" fontWeight={500} noWrap title={email}>
                            {email || "Not available"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{
                          minWidth: 40, height: 40, borderRadius: "50%",
                          bgcolor: "primary.lighter", display: "flex",
                          alignItems: "center", justifyContent: "center", mr: 2
                        }}>
                          <PhoneIcon color="primary" fontSize="small" />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Phone Number</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {contactNo || "Not available"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Bottom Section: Appointments & Chart - Restored to original layout */}
            <Grid item xs={12} md={8} lg={8}>
              <LatestAppointments />
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
              <Typography
                component="h2"
                align="left"
                variant="h6"
                gutterBottom
                color="primary"
              >
                Chart
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 370,
                }}
              >
                <PieChart />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
