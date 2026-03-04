import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Drawer,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Box,
    Typography,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import DoctorSelect from "../../components/DoctorSelect";
import { Report } from "../../types/report";
import moment from "moment";
import PatientSelect from "../../components/PatientSelect";
import { useReportStore } from "../../services/report";
import { useCompanyStore } from "../../services/company";
import { ApiResponse } from "../../types/general";
import { downloadFile, uploadFile } from "../../utils/helper";
import CustomImage from "../../components/CustomImage";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LabSelect from "../../components/LabSelect";
import GetAppIcon from "@mui/icons-material/GetApp";
import "./styles.css"
import ImageUpload from "../../components/ImageUploader";
import AddBulkUploadReport from "./AddBulkUploadReport";

const PrescriptionReportDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const [formData, setFormData] = useState<Report>({
        patient: "",
        doctor: "",
        lab: "",
        type: 1,
        attachments: [],
        date: moment().unix(),
        company: "",
        link: ""
    });
    const [bulkOpen, setbulkOpen] = React.useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const { onUpdate, onCreate, detail, filters, setFilters } = useReportStore();
    const { globalCompanyId } = useCompanyStore();

    const handleChange = (key: string, value: any) => setFormData({ ...formData, [key]: value });

    const handleBulkClickOpen = () => setbulkOpen(true);

    useEffect(() => {
        if (selectedId && isModalOpen) {
            detail(selectedId).then(data => {
                setFormData(data?.data)
            }).catch(error => console.log(error));
        }
    }, [selectedId, isModalOpen])

    const handleFileChange = (uploadedFiles: File[]) => {
        const files = uploadedFiles ? Array.from(uploadedFiles) : [];
        const validFiles = files.filter((file) => file.type.startsWith("image/") || file.type === "application/pdf");
        if (validFiles.length + files.length > 4) {
            alert("You can upload a maximum of 4 files.");
            return;
        }
        setFiles((prev) => [...prev, ...validFiles]);
    };

    const handleSave = async () => {
        try {
            const { patient, doctor, lab, type, attachments } = formData;
            if (!patient) {
                toast.error("Patient selection is required.");
                return;
            }
            if (type === 2 && !doctor) {
                toast.error("Doctor is required for prescriptions.");
                return;
            }
            if (type === 1 && !lab) {
                toast.error("Lab name is required for reports.");
                return;
            }
            if (!files?.length && !attachments?.length) {
                toast.error("File upload is required.");
                return;
            }
            let response: ApiResponse<Report> | null = null;
            if (formData?._id) {
                response = await onUpdate({
                    ...formData,
                    company: globalCompanyId,
                    ...(formData.lab && { lab: formData?.lab }),
                    ...(formData.doctor && { doctor: formData?.doctor })
                })
            } else {
                const { lab, doctor, ...rest } = formData;
                response = await onCreate({
                    ...rest,
                    company: globalCompanyId,
                    ...(formData.lab && { lab: formData?.lab }),
                    ...(formData.doctor && { doctor: formData?.doctor })
                })
            }

            if (response.status >= 200 && response.status < 400) {
                setFormData(response?.data?.data);
            }

            if (response.status >= 200 && response.status < 400 && files.length) {
                const res = await uploadFile({ module: 'report', record_id: response?.data?.data?._id }, files);
                if (res.status >= 200 && res.status < 400) {
                    const filePaths = res.data?.data?.length ? res.data?.data : [];
                    await onUpdate({ attachments: [...attachments, ...filePaths], _id: response?.data?.data?._id })
                    setFiles([])
                    if (response?.data?.data?._id) {
                        detail(response?.data?.data?._id);
                    }
                }
            }
            toggleModal(false);

        } catch (error) {

        }
    };

    const resetForm = () => {
        setFormData({
            patient: "",
            doctor: "",
            lab: "",
            type: 1,
            attachments: [],
            date: moment().unix(),
            company: ""
        });
        setFiles([]);
    };


    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => { resetForm(); toggleModal(false); }


    return (
        <div>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <div className="d-flex align-items-center" style={{ display: 'flex', alignItems: 'center' }}>
                    <PatientSelect
                        sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                        value={filters?.patient}
                        onSelect={function (id: string): void {
                            const filter = id ? { patient: id } : {}
                            setFilters(filter)
                        }} />
                </div>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleBulkClickOpen}
                    >
                        Bulk Upload
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleClickOpen}
                    >
                        Add
                    </Button>
                </Box>
            </Stack>

            <Drawer
                anchor="right"
                open={isModalOpen}
                onClose={handleClose}
            >
                <Box sx={{ width: { xs: '100%', sm: 600 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h6">Prescription / Report Module</Typography>
                        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
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
                            {formData.type === 2 && (
                                <Grid item xs={12}>

                                    <DoctorSelect
                                        sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                                        value={formData.doctor}
                                        onSelect={function (id: string): void {
                                            handleChange("doctor", id)
                                        }} />
                                </Grid>
                            )}
                            {formData.type === 1 && (
                                <Grid item xs={12}>

                                    <LabSelect
                                        sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                                        value={formData.lab}
                                        onSelect={function (id: string): void {
                                            console.log(id);
                                            handleChange("lab", id)
                                        }}
                                    />
                                </Grid>
                            )}

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
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Link"
                                    variant="outlined"
                                    value={formData.link}
                                    rows={1}
                                    onChange={(e) => handleChange("link", e.target.value)}
                                    multiline
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            {
                                formData?.attachments?.length ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 10,
                                            borderWidth: 1,
                                            borderColor: "#bbb",
                                            borderStyle: "solid",
                                            padding: 10,
                                            borderRadius: 20,
                                            margin: "10px 0",
                                        }}
                                    >
                                        {formData?.attachments?.map((attachment, index) => {
                                            const isImage = /\.(jpg|jpeg|png|gif|bmp)$/i.test(attachment);
                                            const isPdf = /\.(pdf)$/i.test(attachment);

                                            return isImage ? (
                                                <div className="preview">
                                                    <CustomImage
                                                        key={index}
                                                        src={attachment}
                                                        style={{
                                                            width: 200,
                                                            height: 100,
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                    <GetAppIcon className="download-icon" onClick={() => downloadFile(attachment)} />
                                                </div>

                                            ) : isPdf ? (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: 200,
                                                        height: 100,
                                                        border: "1px solid #ccc",
                                                        borderRadius: 8,
                                                        backgroundColor: "#f5f5f5",
                                                        position: "relative",
                                                    }}
                                                >
                                                    <PictureAsPdfIcon style={{ fontSize: 40, color: "#d32f2f" }} />
                                                    <GetAppIcon className="download-icon" onClick={() => downloadFile(attachment)} />
                                                </div>
                                            ) : (
                                                <div
                                                    key={index}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: 200,
                                                        height: 100,
                                                        border: "1px solid #ccc",
                                                        borderRadius: 8,
                                                        backgroundColor: "#e0e0e0",
                                                        color: "#555",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Unknown File
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null
                            }

                            <Grid item xs={12}>
                                <ImageUpload onChange={handleFileChange} text="File(s)" />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Drawer>
            <AddBulkUploadReport open={bulkOpen} setOpen={setbulkOpen} />


        </div>
    );
};

export default PrescriptionReportDialog;
