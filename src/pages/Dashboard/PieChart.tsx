import * as React from "react"
import ReactECharts from "echarts-for-react"
import { Box, Typography } from "@mui/material"

export default function PieChart() {
  const option = {
    color: ["#4776E6", "#8E54E9", "#7FCC2C"],
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
      textStyle: {
        fontSize: 12,
        color: "#666",
      },
    },
    series: [
      {
        name: "Patient Data",
        type: "pie",
        radius: ["40%", "70%"],
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
        data: [
          { value: 1048, name: "Patients" },
          { value: 735, name: "Recovered" },
          { value: 580, name: "In ICU" },
        ],
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: (idx:number) => Math.random() * 200,
      },
    ],
  }
  return (
    <React.Fragment>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="#333">
          Patients Summary Last Month
        </Typography>
      </Box>
      <Box sx={{ height: "calc(100% - 40px)", width: "100%" }}>
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
      </Box>
    </React.Fragment>
  )
}
