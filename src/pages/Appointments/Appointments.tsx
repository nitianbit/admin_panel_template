import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AppointmentDialog from "./AppointmentDialog";
import AppointmentTableData from "./AppointmentTableData";
import { useAppContext } from "../../services/context/AppContext";
import { doGET } from "../../utils/HttpUtils";
import { APPOITMENTENDPOINTS } from "../../EndPoints/Appointments";
import { isError } from "../../utils/helper";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const { success, error, userData} = useAppContext();
  const [filters, setFilters] = useState({
      doctor: null
    });


  const getAppointments = async () => {
      try {
        const response = await doGET(APPOITMENTENDPOINTS.getAppointments(filters.doctor))
  
  
        if (response.status >= 200 && response.status < 300) {
          setAppointments(response.data.data)
          // setAppointments((prevState: any) => [...prevState, ...response.data.data]);
        } else if (response.status >= 400 && response.status <= 500) {
          error(response.message)
        }
      } catch (e) {
        if (isError(e)) {
          console.log(e);
        }
      }
    }
  
    useEffect(() => {
      if (userData && !filters.doctor) {
        setFilters((prevState) => ({
          ...prevState,
          doctor: userData._id,
        }));
      }
    }, [userData]);
    
    useEffect(() => {
      if (filters.doctor) {
        getAppointments();
      }
    }, [filters.doctor]);

  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Appointment" />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto"
        }}
      >
        <Toolbar />

        <Container sx={{ mt: 4, mb: 4 }}>
          <AppointmentDialog
            appointments={appointments}
            setAppointments={setAppointments}
            getAppointments={getAppointments}
          />
          <Grid
            container
            spacing={2}
            sx={{ marginleft: "10px", marginTop: "40px" }}
          >
            <AppointmentTableData appointments={appointments} />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Appointments;
