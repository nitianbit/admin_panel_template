"use client"

import * as React from "react"
import ReactECharts from "echarts-for-react"
import { doGET } from "../../utils/HttpUtils"
import { ENDPOINTS } from "../../services/api/constants"
import { Grid, Paper, Box, Typography, CircularProgress } from "@mui/material"
import { useCompanyStore } from "../../services/company"

export default function PatientsByCompany({ companyWise = false }: { companyWise?: boolean }) {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const { globalCompanyId } = useCompanyStore()

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = ENDPOINTS.stats("patients-company-stats")

      if (globalCompanyId && companyWise) {
        url += `?company_id=${globalCompanyId}`
      }
      const response = await doGET(url)
      if (response.status == 200) {
        console.log(response.data?.data)
        setData(response.data?.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [companyWise, globalCompanyId])

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
      },
    },
    legend: {
      top: "5%",
      left: "center",
      type: "scroll",
      textStyle: {
        color: "#666",
        fontSize: 12,
      },
    },
    series: [
      {
        name: "Employees",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "60%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.2)",
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: {
          show: false,
        },
        data,
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: (idx: number) => Math.random() * 200,
      },
    ],
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
      "#4776E6",
    ],
  }

  return (
    <Grid item xs={12} md={6} lg={6}>
      <Paper
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: 400,
          borderRadius: 4,
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="#333">
            Employees By Company
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress size={40} thickness={4} sx={{ color: "#4776E6" }} />
          </Box>
        ) : data.length > 0 ? (
          <ReactECharts
            option={option}
            style={{ height: "calc(100% - 40px)", width: "100%" }}
            opts={{ renderer: "canvas" }}
          />
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  )
}
