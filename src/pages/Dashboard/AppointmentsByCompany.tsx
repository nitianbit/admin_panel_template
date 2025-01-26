import * as React from "react";
import Title from "../../components/Title";
import ReactECharts from "echarts-for-react";
import { doGET } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";

export default function AppointmentsByCompany() {
  const [data, setData] = React.useState([]);

  const fetchData = async () => {
    try {
      const response = await doGET(`${ENDPOINTS.stats('appointments-company-stats')}`);
      if (response.status == 200) {
        setData(response.data?.data)
      }
    } catch (error) {

    }
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  const option = {
    color: ["#9CE0E2", "#079094", "#7FCC2C"],
    tooltip: {
      trigger: "item"
    },
    legend: {
      top: "5%",
      left: "center"
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        label: {
          show: false,
          position: "center"
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold"
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };
  return (
    <React.Fragment>
       <ReactECharts option={option} />
    </React.Fragment>
  );
}
