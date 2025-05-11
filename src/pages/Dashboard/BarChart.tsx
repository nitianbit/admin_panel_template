import * as React from "react"
import ReactECharts from "echarts-for-react"
import { Box, Typography } from "@mui/material"

export default function BarChart() {
  const option = {
    color: ["#4776E6"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          fontSize: 12,
          color: "#666",
          rotate: 0,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          fontSize: 12,
          color: "#666",
        },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#eee",
          },
        },
      },
    ],
    series: [
      {
        name: "Patients",
        type: "bar",
        barWidth: "60%",
        data: [10, 52, 200, 334, 390, 330, 220],
        itemStyle: {
          color: new Function(
            "params",
            `
            return {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#4776E6'
              }, {
                offset: 1, color: '#8E54E9'
              }]
            };
          `,
          ),
          borderRadius: [8, 8, 0, 0],
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowBlur: 5,
          shadowOffsetY: 2,
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
        animationDuration: 1500,
        animationDelay: (idx: number) => idx * 100,
      },
    ],
  }

  return (
    <React.Fragment>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="#333">
          Weekly Patient Visits
        </Typography>
      </Box>
      <Box sx={{ height: "calc(100% - 40px)", width: "100%" }}>
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
      </Box>
    </React.Fragment>
  )
}
