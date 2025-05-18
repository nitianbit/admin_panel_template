"use client"

import * as React from "react"
import ReactECharts from "echarts-for-react"
import { doGET } from "../../utils/HttpUtils"
import { ENDPOINTS } from "../../services/api/constants"
import { Grid, Paper, Box, Typography, CircularProgress } from "@mui/material"
import { useCompanyStore } from "../../services/company"
import useDebounce from "../../hooks/useDebounce"

export default function PatientsByGender({ companyWise = false }: { companyWise?: boolean }) {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const { globalCompanyId } = useCompanyStore();

  const labels =["Male", "Female"];

  const fetchData = useDebounce(async () => {
    setLoading(true)
    try {
      let url = ENDPOINTS.stats("patients-gender-stats")

      if (globalCompanyId && companyWise) {
        url += `?company_id=${globalCompanyId}`
      }
      const response = await doGET(url)
      if (response.status == 200) {
        setData(response.data?.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, 1000)

  React.useEffect(() => {
    fetchData()
  }, [companyWise, globalCompanyId])

  const options = {
    grid: { top: 30, right: 30, bottom: 40, left: 50 },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        fontSize: 12,
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        fontSize: 12,
        color: "#666",
      },
    },
    series: [
      {
        // data: data.map((item: any) => item.value),
        data:labels.map(label => {
          const record: any = data.find((item: any) => item.name === label);
          return record?.value ?? 0
        }),
        type: "bar",
        smooth: true,
        itemStyle: {
          color: new Function(
            "params",
            `
            const colors = ['#4776E6', '#8E54E9'];
            return colors[params.dataIndex % colors.length];
          `,
          ),
          borderRadius: [8, 8, 0, 0],
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          fontSize: 14,
          fontWeight: "bold",
          color: "#666",
        },
        barWidth: "40%",
        animationDuration: 1500,
        animationEasing: "elasticOut",
      },
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
      },
      formatter: "{b}: {c}",
    },
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
            Employees By Gender
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress size={40} thickness={4} sx={{ color: "#4776E6" }} />
          </Box>
        ) : data.length > 0 ? (
          <ReactECharts
            option={options}
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
