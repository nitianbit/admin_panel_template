import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Paper, Slide, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControlLabel, Checkbox } from "@mui/material"
import React, { useEffect, useState } from "react"
import { doGET } from "../../utils/HttpUtils"
import { DOCTORENDPOINTS } from "../../EndPoints/Doctor"
import { useAppContext } from "../../services/context/AppContext"
import { isError } from "../../utils/helper"
import { TransitionProps } from "@mui/material/transitions"

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface PatientDialogProps {
    open: boolean;
    patients: any[];
    handleClose: () => void;
    handleSave: () => void;
}

const PatiendDialog: React.FC<PatientDialogProps> = ({ patients = [], open, handleClose, handleSave }) => {
    const { success, error, userData } = useAppContext()
    const [filters, setFilters] = useState({
        doctor: userData?._id
    });


    const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

    const handleCheckboxChange = (patientId: string) => {
        setSelectedPatients(prevSelected => {
            if (prevSelected.includes(patientId)) {
                return prevSelected.filter(id => id !== patientId);
            } else {
                return [...prevSelected, patientId];
            }
        });
    };

    const handleSelectAllChange = () => {
        if (selectedPatients.length === patients.length) {
            setSelectedPatients([]); // Deselect all if all are selected
        } else {
            setSelectedPatients(patients?.map(patient => patient.id)); // Select all patients
        }
    };



    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="xs"
            fullWidth
            sx={{ height: "100%" }}
        >
            <DialogTitle>Patients</DialogTitle>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="patient table">
                    <TableHead>
                        <TableRow>
                            {patients?.length > 0 && <TableCell align="center">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPatients.length === patients.length}
                                            onChange={handleSelectAllChange}
                                        />
                                    }
                                    label="Select All"
                                />
                            </TableCell>}
                            <TableCell align="center">#</TableCell>
                            <TableCell>FULL NAME</TableCell>
                            <TableCell>GENDER</TableCell>
                            <TableCell>Phone no</TableCell>
                            <TableCell>AGE</TableCell>
                            <TableCell>REFERRED BY DR.</TableCell>
                            <TableCell>APPOINTMENT DATE</TableCell>
                            <TableCell>ASSIGNED DR.</TableCell>
                            <TableCell>STATUS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.length > 0 &&
                            patients?.map((appointment: any, index: any) => (
                                <TableRow
                                    key={index}
                                    // component={Link}
                                    // to={`/patient-detail/${appointment.id}`}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                >
                                    <TableCell align="center">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedPatients.includes(appointment.id)}
                                                    onChange={() => handleCheckboxChange(appointment.id)}
                                                />
                                            }
                                            label=""
                                        /></TableCell>
                                    <TableCell align="center">{appointment.id}</TableCell>
                                    <TableCell>{appointment.fullName}</TableCell>
                                    <TableCell>{appointment.gender}</TableCell>
                                    <TableCell>{appointment.phone}</TableCell>
                                    <TableCell>{appointment.age}</TableCell>
                                    <TableCell>{appointment.referredByDoctor}</TableCell>
                                    <TableCell>{appointment.appointmentDate}</TableCell>
                                    <TableCell>{appointment.assignedDoctor}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={appointment.status}
                                            variant="outlined"
                                            color={appointment.status === "open" ? "success" : "error"}
                                            sx={{ textTransform: "uppercase" }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave} type="submit" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PatiendDialog