import React, { useEffect, useState } from "react";
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
import { useReportStore } from "../../services/report";
import { useCompanyStore } from "../../services/company";
import { ApiResponse } from "../../types/general";
import { uploadFile } from "../../utils/helper";


const PrescriptionReportDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const [formData, setFormData] = useState<Report>({
        patient: "",
        doctor: "",
        lab: "",
        type: 1,
        attachments: [],
        date: moment().unix(),
        company: ""
    });

    const [files, setFiles] = useState<File[]>([]);
    const { onUpdate, onCreate, detail } = useReportStore();
    const { globalCompanyId } = useCompanyStore();

    const handleChange = (key: string, value: any) => setFormData({ ...formData, [key]: value });

    useEffect(() => {
        if (selectedId && isModalOpen) {
            detail(selectedId)
        }
    }, [selectedId, isModalOpen])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        const validFiles = files.filter((file) => file.type.startsWith("image/") || file.type === "application/pdf");
        if (validFiles.length + files.length > 4) {
            alert("You can upload a maximum of 4 files.");
            return;
        }
        setFiles((prev) => [...prev, ...validFiles]);
    };

    const handleSave = async () => {
        try {
            const { patient, doctor, lab, type, attachments, date, } = formData;
            if (!patient) {
                toast.error("Patient selection is required.");
                return;
            }
            if (type === 1 && !doctor) {
                toast.error("Doctor is required for prescriptions.");
                return;
            }
            if (type === 2 && !lab) {
                toast.error("Lab name is required for reports.");
                return;
            }
            if (!files?.length) {
                toast.error("File upload is required.");
                return;
            }
            let response: ApiResponse<Report> | null = null
            if (formData?._id) {
                response = await onUpdate({
                    ...formData,
                    company: globalCompanyId,
                    ...(formData.lab && { lab: formData?.lab })
                })
            } else {
                const { lab, ...rest } = formData
                response = await onCreate({
                    ...rest,
                    company: globalCompanyId,
                    ...(formData.lab && { lab: formData?.lab })
                })
            }

            if (response.status >= 200 && response.status < 400) {
                setFormData(response?.data?.data);
            }

            if (response.status >= 200 && response.status < 400 && files.length) {
                //upload iamge and get url and append
                const res = await uploadFile({ module: 'report', record_id: response?.data?.data?._id }, files);
                if (res.status >= 200 && res.status < 400) {
                    const filePaths = res.data?.data?.length ? res.data?.data : [];
                    await onUpdate({ attachments: filePaths, _id: response?.data?.data?._id })
                    setFiles([])
                    if (response?.data?.data?._id) {
                        detail(response?.data?.data?._id);
                    }
                }

            }

            // automatically save doctor as user if doctor is creating prescription
            console.log("Form Data Saved: ", formData);
            console.log("files Saved: ", files);
            toggleModal(false);

        } catch (error) {

        }
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
                    Add
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
                                    handleChange("patient", id)
                                }} />
                        </Grid>

                        {/* Type Selection */}
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Select Type</InputLabel>
                                <Select
                                    value={formData.type}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                >
                                    <MenuItem value={1}>Report</MenuItem>
                                    <MenuItem value={2}>Prescription</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Doctor Name or Lab Name */}
                        {formData.type === 2 || true && (
                            <Grid item xs={12}>

                                <DoctorSelect
                                    sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                                    value={formData.doctor}
                                    onSelect={function (id: string): void {
                                        handleChange("doctor", id)
                                    }} />
                            </Grid>
                        )}


                        {/* {formData.type === 1 && (
                             
                        )} */}
                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                margin="dense"
                                label="Description"
                                variant="outlined"
                                value={formData.notes}
                                rows={4}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                multiline
                            />
                        </Grid>

                        {/* File Upload */}

                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Upload Files</InputLabel>
                                <input
                                    accept="image/*,application/pdf"
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        component="span"
                                        fullWidth
                                    >
                                        Upload Files (Max 4)
                                    </Button>
                                </label>
                                <FormHelperText>
                                    {files.length > 0
                                        ? `${files.length} file(s) selected`
                                        : "No Files selected"}
                                </FormHelperText>
                            </FormControl>
                        </Grid>

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
