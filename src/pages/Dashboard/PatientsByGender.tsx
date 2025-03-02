import * as React from "react";
import Title from "../../components/Title";
import ReactECharts from "echarts-for-react";
import { doGET } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";
import { Grid, Paper } from "@mui/material";
import { useCompanyStore } from "../../services/company";

export default function PatientsByGender({ companyWise = false }: { companyWise?: boolean }) {
  const [data, setData] = React.useState([]);
  const { globalCompanyId } = useCompanyStore();

  const fetchData = async () => {
    try {
      let url = ENDPOINTS.stats('patients-gender-stats');

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

  
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Male', 'Female'],
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
          <Title>Patients By Genders</Title>
          <ReactECharts option={options} />
        </Paper>
      </Grid>
    </React.Fragment>
  );
}


 