import {
    Button,
    Card,
    CardContent,
    Drawer,
    Grid,
    TextField,
    Box,
    Typography,
    IconButton,
    Stack
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import { useCompanyStore } from "../../services/company";
import { useFormStore } from "../../services/form";
import { FormData } from "../../types/form";

const AddFormDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { detail } = useFormStore();
    const { globalCompanyId } = useCompanyStore();

    const [data, setData] = React.useState<FormData>({
        full_name: "",
        age: "",
        gender: "male",
        email: "",
        mobile: "",
        address: "",
        enquire_about: ""
    });

    const { reset } = useReactHookForm();

    const handleClose = () => toggleModal(false);

    const fetchDetail = async (selectedId: string) => {
        try {
            const response = await detail(selectedId);
            const fetchedData = response?.data;
            reset(fetchedData);
            setData(fetchedData);
        } catch (error) {
            console.error("Failed to fetch detail", error);
        }
    };

    React.useEffect(() => {
        if (selectedId) {
            fetchDetail(selectedId);
        }
    }, [selectedId]);

    return (
        <Drawer
            anchor="right"
            open={isModalOpen}
            onClose={handleClose}
        >
            <Box sx={{ width: { xs: '100%', sm: 600 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6">View Form</Typography>
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    value={data.full_name}
                                                    disabled
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Age"
                                                    value={data.age}
                                                    disabled
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Gender"
                                                    value={data.gender}
                                                    disabled
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    value={data.email}
                                                    disabled
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Mobile"
                                                    value={data.mobile}
                                                    disabled
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Address"
                                                    value={data.address}
                                                    disabled
                                                    multiline
                                                    rows={2}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Enquire About"
                                                    value={data.enquire_about}
                                                    disabled
                                                    multiline
                                                    rows={3}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </form>
                </Box>

                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={handleClose} variant="contained">Close</Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AddFormDialog;
