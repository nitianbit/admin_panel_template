import * as React from "react";
import Title from "../../components/Title";
import ReactECharts from "echarts-for-react";
import { doGET } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";
import { Grid, Paper } from "@mui/material";
import { useCompanyStore } from "../../services/company";

export default function PatientsByAge({ companyWise = false }: { companyWise?: boolean }) {
  const [data, setData] = React.useState([]);
  const { globalCompanyId } = useCompanyStore();

  const fetchData = async () => {
    try {
      let url = ENDPOINTS.stats('patients-age-group-stats');

      if (globalCompanyId && companyWise) {
        url += `?company_id=${globalCompanyId}`;
      }
      const response = await doGET(url);
      if (response.status == 200) {
        setData(response.data?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [companyWise, globalCompanyId]);

 

  // const option = {
  //   color: ["#9CE0E2", "#079094", "#7FCC2C"],
  //   tooltip: {
  //     trigger: "axis",
  //     axisPointer: {
  //       type: "shadow", // Show shadow on hover
  //     },
  //   },
  //   xAxis: {
  //     type: "category",
  //     data: barData.map((item) => item.name), // X-axis labels (company names)
  //     axisLabel: {
  //       rotate: 45, // Rotate labels if they are too long
  //     },
  //   },
  //   yAxis: {
  //     type: "value",
  //   },
  //   series: [
  //     {
  //       type: "bar",
  //       data: barData.map((item) => item.value), // Y-axis values (appointment counts)
  //       barWidth: "60%", // Adjust bar width
  //       itemStyle: {
  //         borderRadius: [5, 5, 0, 0], // Rounded corners for bars
  //       },
  //       label: {
  //         show: true, // Show values on top of bars
  //         position: "top",
  //       },
  //     },
  //   ],
  // };

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['< 20', '21-30', '31-40', '41-50', '50 >'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.map((item: any) => item.value),
        type: 'bar',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

   
  return (
    <React.Fragment>
      <Grid item xs={12} md={6} lg={6}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 400,
          }}
        >
          <Title>Patients Age Group</Title>
          <ReactECharts option={options} />
        </Paper>
      </Grid>
    </React.Fragment>
  );
}


 