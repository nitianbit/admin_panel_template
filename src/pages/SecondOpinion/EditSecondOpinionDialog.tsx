import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    FormControl,
    Button,
    Card,
    CardContent,
    InputLabel,
    FormHelperText,
    IconButton,
    Slide,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { doGET, doPOST, doPUT } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";
import { uploadFile } from "../../utils/helper";
import { TransitionProps } from "@mui/material/transitions";
import AddIcon from "@mui/icons-material/Add";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface FileItem {
    name: string;
    file: File;
}

// const FILE_BASE_URL = "https://myewacare.com/api/"; // base URL for files
const FILE_BASE_URL = "http://93.127.199.40:4031/api/"; // base URL for files
// 

const EditSecondOpinionDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const [data, setData] = useState<any>({
        full_name: "",
        email: "",
        concern: "",
        medical_record: []
    });

    const [files, setFiles] = useState<FileItem[]>([]);

    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const fetchRecord = async (id: string) => {
        try {
            const res = await doGET(`${ENDPOINTS.detail("second-opinion", id)}`);
            if (res.data?.data) {
                // prepend base URL to all file links if not already absolute
                const transformedData = {
                    ...res.data?.data,
                    medical_record: res.data?.data.medical_record?.map((file: string) =>
                        file.startsWith("http") ? file : `${FILE_BASE_URL}${file}`
                    )
                };
                setData(transformedData);
            }
        } catch (error) { }
    };

    useEffect(() => {
        setData({
            full_name: "",
            email: "",
            concern: "",
            medical_record: []
        });

        if (selectedId && isModalOpen) fetchRecord(selectedId);
    }, [selectedId, isModalOpen]);

    // Upload any file
    const handleFileUpload = (event: any) => {
        const uploaded: File[] = event.target.files ? Array.from(event.target.files) : [];

        if (uploaded.length + files.length > 5) {
            alert("You can upload a maximum of 5 files.");
            return;
        }

        const formatted: FileItem[] = uploaded.map((f) => ({
            name: f.name,
            file: f,
        }));

        setFiles((prev) => [...prev, ...formatted]);
    };

    const handleFileDelete = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const { full_name, email, concern } = data;

            let response = null;

            // UPDATE
            if (data?._id) {
                response = await doPUT(ENDPOINTS.update("second-opinion"), {
                    _id: data?._id,
                    full_name,
                    email,
                    concern
                });
            }
            // CREATE
            else {
                response = await doPOST(ENDPOINTS.create("second-opinion"), {
                    full_name,
                    email,
                    concern
                });
            }

            // Upload files
            if (response.status >= 200 && response.status < 400 && files.length) {
                const uploadRes = await uploadFile(
                    { module: "second-opinion", record_id: response?.data?.data?._id },
                    files.map((f) => f.file)
                );

                if (uploadRes.status >= 200 && uploadRes.status < 400) {
                    await doPUT(ENDPOINTS.update("second-opinion"), {
                        _id: response?.data?.data?._id,
                        medical_record: [
                            ...(data?.medical_record ?? []),
                            ...uploadRes.data?.data.map((file: string) =>
                                file.startsWith("http") ? file : `${FILE_BASE_URL}${file}`
                            )
                        ]
                    });

                    setFiles([]);
                    fetchRecord(response?.data?.data?._id);
                }
            }

            handleClose();
        } catch (error) { }
    };

    const handleChange = (key: string, value: any) => {
        setData((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Second Opinion
                </Button>
            </Stack>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="lg"
                fullWidth
                sx={{ height: "100%", padding: { lg: 4 } }}
            >
                <DialogTitle>Second Opinion Record</DialogTitle>

                <DialogContent dividers>
                    <Card>
                        <CardContent>

                            <TextField
                                fullWidth
                                label="Full Name"
                                margin="dense"
                                value={data.full_name}
                                onChange={(e) => handleChange("full_name", e.target.value)}
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                margin="dense"
                                value={data.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />

                            <TextField
                                fullWidth
                                label="Concern"
                                margin="dense"
                                value={data.concern}
                                onChange={(e) => handleChange("concern", e.target.value)}
                            />

                            {/* Existing files */}
                            {data?.medical_record?.length ? (
                                <Box sx={{ mt: 2 }}>
                                    {data.medical_record.map((file: string, index: number) => (
                                        <a
                                            key={index}
                                            href={file} // now always includes FILE_BASE_URL
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: "block", marginBottom: 8 }}
                                        >
                                            File {index + 1}
                                        </a>
                                    ))}
                                </Box>
                            ) : null}

                            {/* Upload files */}
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Upload Files</InputLabel>

                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                    id="file-upload"
                                />

                                <label htmlFor="file-upload">
                                    <Button variant="outlined" component="span" fullWidth>
                                        Upload Files (Max 5)
                                    </Button>
                                </label>

                                <FormHelperText>
                                    {files.length > 0
                                        ? `${files.length} file(s) selected`
                                        : "No files selected"}
                                </FormHelperText>
                            </FormControl>

                            {/* New file list */}
                            <Box mt={2}>
                                {files.map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            borderBottom: "1px solid #ccc",
                                            padding: "8px 0"
                                        }}
                                    >
                                        <Typography>{file.name}</Typography>
                                        <IconButton onClick={() => handleFileDelete(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>

                        </CardContent>
                    </Card>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                    >
                        Submit Second Opinion
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditSecondOpinionDialog;
