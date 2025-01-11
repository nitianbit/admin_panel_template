import React, { useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Switch,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import GridDialog from "../../components/Dialog/GridDialog";
import DoctorSelect from "../../components/DoctorSelect";
import { Report } from "../../types/report";
import moment from "moment";
import PatientSelect from "../../components/PatientSelect";


const PrescriptionReportDialog = ({ isModalOpen, toggleModal }: any) => {
    const [formData, setFormData] = useState<Report>({
        patient: "",
        doctor: "",
        lab: "",
        type: 1,
        attachments: [],
        date: moment().unix()
    });


    const handleChange = (key: string, value: any) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            handleChange("file", event.target.files[0]);
        }
    };

    const handleSave = () => {
        const { patient, doctor, lab, type, attachments, date, } = formData;

        if (!patient) {
            toast.error("Patient selection is required.");
            return;
        }

        if (type === 2 && !doctor) {
            toast.error("Doctor is required for prescriptions.");
            return;
        }

        if (type === 1) {
            if (!lab) {
                toast.error("Lab name is required for reports.");
                return;
            }
            if (!attachments?.length) {
                toast.error("File upload is required for reports.");
                return;
            }
        }

        // Perform save action (API call or state update)
        console.log("Form Data Saved: ", formData);
        toggleModal(false);
    };

    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    return (
        <div>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <SearchInput />
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                    Add Company
                </Button>
            </Stack>

            <Dialog open={isModalOpen} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Prescription / Report Module</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* Patient Selection */}
                        <Grid item xs={12}>
                            <PatientSelect
                                sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                                value={formData.patient}
                                onSelect={function (id: string): void {
                                    console.log(id);
                                }} />
                        </Grid>

                        {/* Type Selection */}
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                >
                                    <MenuItem value="Prescription">Prescription</MenuItem>
                                    <MenuItem value="Report">Report</MenuItem>
                                </Select>
                                <FormHelperText>Select type</FormHelperText>
                            </FormControl>
                        </Grid>

                        {/* Doctor Name or Lab Name */}
                        {formData.type === 2 || true && (
                            <Grid item xs={12}>

                                <DoctorSelect
                                    sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                                    value={formData.doctor}
                                    onSelect={function (id: string): void {
                                        console.log(id);
                                    }} />
                            </Grid>
                        )}

                        {formData.type === 1 && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Lab Name"
                                    value={formData.lab}
                                    onChange={(e) => handleChange("lab", e.target.value)}
                                    required
                                />
                            </Grid>
                        )}

                        {/* File Upload */}
                        {formData.type === 2 && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <input
                                        accept="application/pdf,image/*"
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileUpload}
                                        style={{ display: "none" }}
                                    />
                                    <label htmlFor="file-upload">
                                        <Button variant="outlined" color="primary" component="span">
                                            Upload File
                                        </Button>
                                    </label>
                                    {/* {formData.file && (
                  <FormHelperText>{formData.file.name}</FormHelperText>
                )} */}
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
};

export default PrescriptionReportDialog;
