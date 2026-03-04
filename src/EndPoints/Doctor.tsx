export const DOCTORENDPOINTS = {
    getPatient :(doctorId:any) =>`/patients/grid?doctor=${doctorId}`,
    getDoctors : `doctors/grid`
}