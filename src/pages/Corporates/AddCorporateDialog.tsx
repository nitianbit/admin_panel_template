
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, Grid, IconButton, MenuItem, FormControl, InputLabel, Select, Divider, Checkbox, FormControlLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { useForm, Controller } from "react-hook-form";
import { useCorporateStore } from "../../services/corporates";
import { ICorporate, CreateCorporateRequest, UpdateCorporateRequest } from "../../types/corporates";
import { INDUSTRIES } from "./constants";

export default function AddCorporateDialog({
    isModalOpen,
    toggleModal,
    selectedId
}: any) {
    const { onCreate, detail, onUpdate } = useCorporateStore();

    const defaultValues: CreateCorporateRequest = {
        name: "",
        companyName: "",
        email: "",
        phone: "",
        contactPerson: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        logoUrl: "",
        website: "",
        domain: "",
        industry: "Technology",
        employeeCount: 0,
        description: "",
        isActive: true,
        isVerified: false,
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateCorporateRequest>({
        defaultValues: defaultValues
    });

    const handleClickOpen = () => {
        reset(defaultValues);
        toggleModal(true);
    };

    const handleClose = () => {
        toggleModal(false);
        reset(defaultValues);
    };

    const onSubmit = (data: CreateCorporateRequest) => {
        const payload = {
            ...data,
            employeeCount: Number(data.employeeCount)
        };

        if (selectedId) {
            onUpdate(selectedId, payload as UpdateCorporateRequest);
        } else {
            onCreate(payload);
        }
        handleClose();
    };

    const fetchDetail = async (id: string) => {
        try {
            const response = await detail(id);
            if (response?.data) {
                reset(response.data as any);
            }
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        if (selectedId && isModalOpen) {
            fetchDetail(selectedId);
        } else if (!selectedId && isModalOpen) {
            reset(defaultValues);
        }
    }, [selectedId, isModalOpen]);

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
                    Add Corporate
                </Button>
            </Stack>

            <Drawer
                anchor="right"
                open={isModalOpen}
                onClose={handleClose}
            >
                <Box sx={{ width: { xs: '100%', sm: 600 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h6">{selectedId ? 'Edit Corporate' : 'Add Corporate'}</Typography>
                        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                {/* Basic Info */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Basic Information</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'Name is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Name"
                                                fullWidth
                                                size="small"
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="companyName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Company Name"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="industry"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Industry</InputLabel>
                                                <Select {...field} label="Industry">
                                                    {INDUSTRIES.map((industry) => (
                                                        <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="employeeCount"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Employee Count"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Contact Details */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Contact Details</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Email"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Phone"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="contactPerson"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Contact Person"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="website"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Website"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Location */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Location</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Address"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6} sm={4}>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="City"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6} sm={4}>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="State"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6} sm={4}>
                                    <Controller
                                        name="pincode"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Pincode"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Additional Info */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Description"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <FormControlLabel
                                                control={<Checkbox checked={value} onChange={onChange} />}
                                                label="Is Active"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Controller
                                        name="isVerified"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <FormControlLabel
                                                control={<Checkbox checked={value} onChange={onChange} />}
                                                label="Is Verified"
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Box>

                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
                        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
}
