"use client"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Toolbar from "@mui/material/Toolbar"
import * as React from "react"
import Appbar from "../../components/Appbar"
import HealthCard from "./HealthCard"
import ReactECharts from "echarts-for-react"

import { ENDPOINTS } from "../../services/api/constants"
import { doGET } from "../../utils/HttpUtils"
import { useCompanyStore } from "../../services/company"
import {
  Typography,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material"
import {
  dashboard_default_stats,
  dashboardCards,
  defaultAnalyticsData,
  analyticsOverviewCards,
} from "./constants"
import type {
  DASHBOARD_STATS,
  AnalyticsData,
} from "./constants"
import AppointmentsByCompany from "./AppointmentsByCompany"
import PatientsByDoctor from "./PatientsByDoctor"
import PatientsByCompany from "./PatientsByCompany"
import PatientsByAge from "./PatientsByAge"
import PatientsByGender from "./PatientsByGender"

// Helper to format date string YYYYMMDD -> YYYY-MM-DD for input
const formatDateForInput = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) return ""
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
}

// Helper to format date YYYY-MM-DD -> YYYYMMDD for API
const formatDateForAPI = (dateStr: string): string => {
  return dateStr.replace(/-/g, "")
}

// Helper to format YYYYMMDD -> readable label (e.g. "Feb 13")
const formatDateLabel = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr
  const year = dateStr.slice(0, 4)
  const month = parseInt(dateStr.slice(4, 6), 10)
  const day = parseInt(dateStr.slice(6, 8), 10)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[month - 1]} ${day}`
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.replace(/-/g, " ").slice(1)
}

// Card gradients for old stats
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
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData>(defaultAnalyticsData)
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false)
  const { globalCompanyId } = useCompanyStore()

  // Default to current month
  const now = new Date()
  const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

  const [dateFrom, setDateFrom] = React.useState(firstOfMonth)
  const [dateTo, setDateTo] = React.useState(today)

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

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const fromAPI = formatDateForAPI(dateFrom)
      const toAPI = formatDateForAPI(dateTo)
      const url = ENDPOINTS.dashboardAnalytics(fromAPI, toAPI)
      const response = await doGET(url)
      if (response.status == 200 && response.data?.success) {
        setAnalyticsData(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [companyWise, globalCompanyId])

  React.useEffect(() => {
    if (dateFrom && dateTo) {
      fetchAnalytics()
    }
  }, [])

  const handleApplyFilter = () => {
    if (dateFrom && dateTo) {
      fetchAnalytics()
    }
  }

  // --- Chart Options ---

  // Bookings by Type - Pie Chart
  const bookingsByTypeOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => `${params.name}<br/>Count: ${params.data.count}<br/>Amount: ${formatCurrency(params.data.amount)}<br/>Share: ${params.percent}%`,
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e0e0e0",
      borderWidth: 1,
      textStyle: { color: "#333" },
    },
    legend: {
      bottom: "0%",
      left: "center",
      textStyle: { color: "#666", fontSize: 12 },
    },
    series: [
      {
        name: "Booking Type",
        type: "pie",
        radius: ["40%", "68%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}\n{c}",
          fontSize: 11,
        },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: "bold" },
          itemStyle: { shadowBlur: 15, shadowColor: "rgba(0,0,0,0.3)" },
        },
        data: analyticsData.bookings.byType
          .filter((b) => b.count > 0)
          .map((b) => ({
            value: b.count,
            name: capitalize(b.bookingType),
            count: b.count,
            amount: b.amount,
          })),
        animationType: "scale",
        animationEasing: "elasticOut",
      },
    ],
    color: ["#667eea", "#f093fb", "#43C6AC", "#FF9966", "#52ACFF"],
  }

  // Bookings by Status - Pie Chart
  const bookingsByStatusOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => `${params.name}<br/>Count: ${params.data.count}<br/>Amount: ${formatCurrency(params.data.amount)}<br/>Share: ${params.percent}%`,
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e0e0e0",
      borderWidth: 1,
      textStyle: { color: "#333" },
    },
    legend: {
      bottom: "0%",
      left: "center",
      textStyle: { color: "#666", fontSize: 12 },
    },
    series: [
      {
        name: "Booking Status",
        type: "pie",
        radius: ["40%", "68%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}\n{c}",
          fontSize: 11,
        },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: "bold" },
          itemStyle: { shadowBlur: 15, shadowColor: "rgba(0,0,0,0.3)" },
        },
        data: analyticsData.bookings.byStatus
          .filter((b) => b.count > 0)
          .map((b) => ({
            value: b.count,
            name: capitalize(b.status),
            count: b.count,
            amount: b.amount,
          })),
        animationType: "scale",
        animationEasing: "elasticOut",
      },
    ],
    color: ["#fac858", "#43C6AC", "#91cc75", "#ee6666"],
  }

  // Bookings Trend - Bar + Line Chart
  const bookingsTrendOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e0e0e0",
      borderWidth: 1,
      textStyle: { color: "#333" },
    },
    legend: {
      data: ["Bookings", "Amount"],
      top: "0%",
      textStyle: { color: "#666" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: analyticsData.trends.bookingsByDate.map((t) => formatDateLabel(t.date)),
      axisLabel: { fontSize: 11, color: "#666", rotate: 45 },
      axisTick: { alignWithLabel: true },
    },
    yAxis: [
      {
        type: "value",
        name: "Count",
        axisLabel: { fontSize: 11, color: "#666" },
        splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
      },
      {
        type: "value",
        name: "Amount (₹)",
        axisLabel: { fontSize: 11, color: "#666", formatter: (v: number) => `₹${(v / 1000).toFixed(0)}K` },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "Bookings",
        type: "bar",
        data: analyticsData.trends.bookingsByDate.map((t) => t.count),
        barWidth: "50%",
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "#667eea" },
              { offset: 1, color: "#764ba2" },
            ],
          },
        },
        animationDelay: (idx: number) => idx * 80,
      },
      {
        name: "Amount",
        type: "line",
        yAxisIndex: 1,
        data: analyticsData.trends.bookingsByDate.map((t) => t.amount),
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3, color: "#f093fb" },
        itemStyle: { color: "#f093fb", borderWidth: 2, borderColor: "#fff" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(240,147,251,0.3)" },
              { offset: 1, color: "rgba(240,147,251,0.02)" },
            ],
          },
        },
        animationDelay: (idx: number) => idx * 80 + 300,
      },
    ],
  }

  // Revenue Trend - Bar Chart
  const revenueTrendOption = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e0e0e0",
      borderWidth: 1,
      textStyle: { color: "#333" },
      formatter: (params: any) => {
        const p = params[0]
        return `${p.name}<br/>Revenue: ${formatCurrency(p.value)}<br/>Transactions: ${analyticsData.trends.revenueByDate[p.dataIndex]?.transactions || 0}`
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: analyticsData.trends.revenueByDate.map((r) => formatDateLabel(r.date)),
      axisLabel: { fontSize: 11, color: "#666" },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 11, color: "#666", formatter: (v: number) => `₹${v}` },
      splitLine: { lineStyle: { type: "dashed", color: "#eee" } },
    },
    series: [
      {
        name: "Revenue",
        type: "bar",
        data: analyticsData.trends.revenueByDate.map((r) => r.amount),
        barWidth: "60%",
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "#43C6AC" },
              { offset: 1, color: "#191654" },
            ],
          },
        },
        label: {
          show: true,
          position: "top",
          formatter: (params: any) => formatCurrency(params.value),
          fontSize: 12,
          fontWeight: "bold",
          color: "#333",
        },
      },
    ],
  }

  // Booking Value Breakdown - Horizontal Bar
  const bookingValueOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(255,255,255,0.95)",
      borderColor: "#e0e0e0",
      borderWidth: 1,
      textStyle: { color: "#333" },
      formatter: (params: any) => {
        return params.map((p: any) => `${p.seriesName}: ${formatCurrency(p.value)}`).join("<br/>")
      },
    },
    legend: {
      data: ["Paid Value", "Pending Value"],
      top: "0%",
      textStyle: { color: "#666" },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      axisLabel: { fontSize: 11, color: "#666", formatter: (v: number) => `₹${(v / 1000).toFixed(0)}K` },
    },
    yAxis: {
      type: "category",
      data: ["Bookings"],
      axisLabel: { fontSize: 12, color: "#666" },
    },
    series: [
      {
        name: "Paid Value",
        type: "bar",
        stack: "total",
        data: [analyticsData.bookings.paidValue],
        itemStyle: { color: "#43C6AC", borderRadius: [0, 0, 0, 0] },
        label: { show: true, formatter: (p: any) => formatCurrency(p.value), fontSize: 11, color: "#fff" },
      },
      {
        name: "Pending Value",
        type: "bar",
        stack: "total",
        data: [analyticsData.bookings.pendingValue],
        itemStyle: { color: "#fac858", borderRadius: [0, 6, 6, 0] },
        label: { show: true, formatter: (p: any) => formatCurrency(p.value), fontSize: 11, color: "#333" },
      },
    ],
  }

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
            background: "linear-gradient(90deg, #02989D 0%, rgb(74, 220, 225) 100%)",
            color: "white",
            py: 4,
            px: 3,
            mb: 4,
          }}
        >
          <Container maxWidth="xl">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Myewacare Dashboard
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ mb: 6 }}>
          {/* Original Stats Cards */}
          {/* <Grid container spacing={3}>
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
          </Grid> */}

          {/* Analytics Section Divider */}
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

          {/* Date Filter */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
              background: "white",
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <Typography variant="subtitle1" fontWeight={600} color="#333" sx={{ mr: 1 }}>
                Date Range:
              </Typography>
              <TextField
                label="From"
                type="date"
                size="small"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  minWidth: 180,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#02989D" },
                    "&.Mui-focused fieldset": { borderColor: "#02989D" },
                  },
                }}
              />
              <TextField
                label="To"
                type="date"
                size="small"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  minWidth: 180,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#02989D" },
                    "&.Mui-focused fieldset": { borderColor: "#02989D" },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleApplyFilter}
                disabled={analyticsLoading}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg, #02989D 0%, #4adce1 100%)",
                  boxShadow: "0 4px 12px rgba(2,152,157,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #027b7f 0%, #38c8cd 100%)",
                    boxShadow: "0 6px 18px rgba(2,152,157,0.4)",
                  },
                }}
              >
                {analyticsLoading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Apply Filter"}
              </Button>
              {analyticsData.dateRange.dateFrom && (
                <Chip
                  label={`${formatDateLabel(analyticsData.dateRange.dateFrom)} — ${formatDateLabel(analyticsData.dateRange.dateTo)}`}
                  sx={{
                    fontWeight: 600,
                    bgcolor: "rgba(2,152,157,0.1)",
                    color: "#02989D",
                    fontSize: "0.85rem",
                  }}
                />
              )}
            </Stack>
          </Paper>

          {/* Analytics Overview Cards */}
          {analyticsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={48} sx={{ color: "#02989D" }} />
            </Box>
          ) : (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {analyticsOverviewCards.map((card, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl>
                    <Paper
                      sx={{
                        p: 0,
                        overflow: "hidden",
                        height: 160,
                        borderRadius: 4,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                        background: card.gradient,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <HealthCard
                        icon={card.icon}
                        title={card.title}
                        value={
                          (card as any).prefix
                            ? `${(card as any).prefix}${analyticsData.overview[card.key].toLocaleString("en-IN")}`
                            : analyticsData.overview[card.key]
                        }
                        color="white"
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Bookings Trend Chart */}
              {analyticsData.trends.bookingsByDate.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                        height: 450,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                        Booking Trends
                      </Typography>
                      <Box sx={{ height: "calc(100% - 36px)" }}>
                        <ReactECharts option={bookingsTrendOption} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {/* Pie Charts Row */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Bookings by Type */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      height: 400,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                      Bookings by Type
                    </Typography>
                    {analyticsData.bookings.byType.filter((b) => b.count > 0).length > 0 ? (
                      <Box sx={{ height: "calc(100% - 36px)" }}>
                        <ReactECharts option={bookingsByTypeOption} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100% - 36px)" }}>
                        <Typography color="text.secondary">No data available</Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                {/* Bookings by Status */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      height: 400,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                      Bookings by Status
                    </Typography>
                    {analyticsData.bookings.byStatus.filter((b) => b.count > 0).length > 0 ? (
                      <Box sx={{ height: "calc(100% - 36px)" }}>
                        <ReactECharts option={bookingsByStatusOption} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100% - 36px)" }}>
                        <Typography color="text.secondary">No data available</Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              {/* Payment & Value Stats Row */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Booking Value Breakdown */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      height: 280,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                      Booking Value Breakdown
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Total Value: {formatCurrency(analyticsData.bookings.totalValue)}
                    </Typography>
                    <Box sx={{ height: "calc(100% - 64px)" }}>
                      <ReactECharts option={bookingValueOption} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
                    </Box>
                  </Paper>
                </Grid>

                {/* Payment Summary */}
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      height: 280,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                      Payment Summary
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {/* Booking Payments */}
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(118,75,162,0.08) 100%)",
                            border: "1px solid rgba(102,126,234,0.15)",
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={700} color="#667eea" gutterBottom>
                            Booking Payments
                          </Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              Total Txns: <b>{analyticsData.payments.booking.totalTransactions}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Paid Txns: <b>{analyticsData.payments.booking.paidTransactions}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Collected: <b>{formatCurrency(analyticsData.payments.booking.totalCollected)}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Discount: <b>{formatCurrency(analyticsData.payments.booking.totalDiscount)}</b>
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>

                      {/* Wallet Recharge */}
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, rgba(67,198,172,0.08) 0%, rgba(25,22,84,0.08) 100%)",
                            border: "1px solid rgba(67,198,172,0.15)",
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={700} color="#43C6AC" gutterBottom>
                            Wallet Recharge
                          </Typography>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              Total Txns: <b>{analyticsData.payments.walletRecharge.totalTransactions}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Paid Txns: <b>{analyticsData.payments.walletRecharge.paidTransactions}</b>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Collected: <b>{formatCurrency(analyticsData.payments.walletRecharge.totalCollected)}</b>
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              {/* Revenue Trend */}
              {analyticsData.trends.revenueByDate.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                        height: 350,
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                        Revenue by Date
                      </Typography>
                      <Box sx={{ height: "calc(100% - 36px)" }}>
                        <ReactECharts option={revenueTrendOption} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {/* Booking Type Detail Table */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="#333" gutterBottom>
                      Booking Type Details
                    </Typography>
                    <Box
                      component="table"
                      sx={{
                        width: "100%",
                        borderCollapse: "collapse",
                        mt: 2,
                        "& th": {
                          textAlign: "left",
                          py: 1.5,
                          px: 2,
                          borderBottom: "2px solid #e0e0e0",
                          color: "#555",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        },
                        "& td": {
                          py: 1.5,
                          px: 2,
                          borderBottom: "1px solid #f0f0f0",
                          fontSize: "0.9rem",
                          color: "#333",
                        },
                        "& tr:hover td": {
                          bgcolor: "rgba(2,152,157,0.04)",
                        },
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Count</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.bookings.byType.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <Chip
                                label={capitalize(item.bookingType)}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  bgcolor:
                                    item.bookingType === "package"
                                      ? "rgba(102,126,234,0.1)"
                                      : item.bookingType === "consultation"
                                        ? "rgba(240,147,251,0.1)"
                                        : item.bookingType === "second-opinion"
                                          ? "rgba(67,198,172,0.1)"
                                          : "rgba(255,153,102,0.1)",
                                  color:
                                    item.bookingType === "package"
                                      ? "#667eea"
                                      : item.bookingType === "consultation"
                                        ? "#d63384"
                                        : item.bookingType === "second-opinion"
                                          ? "#43C6AC"
                                          : "#FF9966",
                                }}
                              />
                            </td>
                            <td><b>{item.count}</b></td>
                            <td>{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {/* Original Charts Section */}
          {/* <Box sx={{ my: 5, display: "flex", alignItems: "center" }}>
            <Divider sx={{ flexGrow: 1, borderColor: "rgba(0,0,0,0.1)" }} />
            <Typography
              variant="h5"
              sx={{
                px: 2,
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Company & Doctor Insights
            </Typography>
            <Divider sx={{ flexGrow: 1, borderColor: "rgba(0,0,0,0.1)" }} />
          </Box> */}

          {/* <Grid container spacing={3}>
            <AppointmentsByCompany companyWise={companyWise} />
            <PatientsByDoctor companyWise={companyWise} />
            <PatientsByCompany companyWise={companyWise} />
            <PatientsByAge companyWise={companyWise} />
            <PatientsByGender companyWise={companyWise} />
          </Grid> */}
        </Container>
      </Box>
    </Box>
  )
}
