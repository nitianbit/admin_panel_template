import { create } from "@mui/material/styles/createTransitions";

export const APPOITMENTENDPOINTS = {
    getAppointments :(doctorId:any) =>`/appointments/grid?doctor=${doctorId}`,
    createAppointment :'/appointments/create',
}