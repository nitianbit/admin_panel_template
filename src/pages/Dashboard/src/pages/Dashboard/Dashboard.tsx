"use client"

import React from "react"
import { Box, Typography, Grid } from "@mui/material"
import { DashboardCard } from "../../components/DashboardCard/DashboardCard"
import { dashboard_default_stats, type DASHBOARD_STATS, dashboardCards } from "./constants"

type Props = {}

const Dashboard: React.FC<Props> = () => {
  const [dashboardStats, setDashboardStats] = React.useState<DASHBOARD_STATS>(dashboard_default_stats)

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.title}>
            <DashboardCard title={card.title} value={dashboardStats[card.key]} icon={card.icon} color={card.color} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Dashboard
