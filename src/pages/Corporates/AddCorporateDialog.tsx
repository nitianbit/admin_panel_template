
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
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { showError } from "../../services/toaster";
import { MODULES } from "../../utils/constants";
import { uploadFile } from "../../utils/helper";

export default function AddCorporateDialog({
    isModalOpen,
    toggleModal,
    selectedId
}: any) {
    const { onCreate, detail, onUpdate, filters, setFilters } = useCorporateStore();

    const imageFileRef = React.useRef<File | null>(null);
    const [existingLogoUrl, setExistingLogoUrl] = React.useState<string>("");

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
        imageFileRef.current = null;
        setExistingLogoUrl("");
        toggleModal(true);
    };

    const handleClose = () => {
        toggleModal(false);
        reset(defaultValues);
        imageFileRef.current = null;
        setExistingLogoUrl("");
    };

    // Filter states
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const LOCATIONS = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
        'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
        'Indore', 'Thane', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
        'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
        'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi',
        'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
        'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Noida', 'Gurugram'
    ];

    const applyFilters = (query: string) => {
        const newFilters: any = { ...filters };

        if (query.trim()) {
            const searchTerm = query.trim().toLowerCase();

            // Check if search matches an industry
            const matchedIndustry = INDUSTRIES.find(
                i => i.toLowerCase().includes(searchTerm) || searchTerm.includes(i.toLowerCase())
            );

            // Check if search matches a location
            const matchedLocation = LOCATIONS.find(
                l => l.toLowerCase().includes(searchTerm) || searchTerm.includes(l.toLowerCase())
            );

            if (matchedIndustry) {
                newFilters.industry = matchedIndustry;
                delete newFilters.city;
                delete newFilters.name;
            } else if (matchedLocation) {
                newFilters.city = matchedLocation;
                delete newFilters.industry;
                delete newFilters.name;
            } else {
                newFilters.name = query.trim();
                delete newFilters.industry;
                delete newFilters.city;
            }
        } else {
            delete newFilters.name;
            delete newFilters.industry;
            delete newFilters.city;
            delete newFilters.search;
        }

        setFilters(newFilters);
    };

    const handleSearchChange = (e: any) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters(value);
        }, 300);
    };

    const onSubmit = async (data: CreateCorporateRequest) => {
        let logoUrl = existingLogoUrl || "";
        if (imageFileRef.current instanceof File) {
            const uploadRes = await uploadFile({ module: MODULES.CORPORATE }, [imageFileRef.current]);
            if (uploadRes.error) {
                showError(uploadRes.message || 'Failed to upload logo');
                return;
            }
            const uploadedFiles = uploadRes.data?.data?.files;
            if (uploadedFiles?.length && uploadedFiles[0]?.url) {
                logoUrl = uploadedFiles[0].url;
            }
        }

        const rawPayload: any = {
            ...data,
            employeeCount: Number(data.employeeCount),
            ...(logoUrl && { logoUrl }),
        };

        // Remove empty string values for optional fields to avoid backend validation errors
        const payload = Object.fromEntries(
            Object.entries(rawPayload).filter(([key, value]) => key === 'name' || value !== '')
        ) as unknown as CreateCorporateRequest;

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
            if (response) {
                reset(response as any);
                if (response.logoUrl && typeof response.logoUrl === 'string') {
                    setExistingLogoUrl(response.logoUrl);
                }
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
            imageFileRef.current = null;
            setExistingLogoUrl("");
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
                <SearchInput handleChange={handleSearchChange} />
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
                                        rules={{
                                            required: 'Name is required',
                                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Name"
                                                fullWidth
                                                size="small"
                                                error={!!errors.name}
                                                helperText={errors.name?.message as string}
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
                                                error={!!errors.companyName}
                                                helperText={errors.companyName?.message as string}
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
                                        rules={{
                                            min: { value: 0, message: 'Employee count cannot be negative' },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Employee Count"
                                                fullWidth
                                                size="small"
                                                error={!!errors.employeeCount}
                                                helperText={errors.employeeCount?.message as string}
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
                                        rules={{
                                            pattern: {
                                                value: /^$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Please enter a valid email address',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Email"
                                                fullWidth
                                                size="small"
                                                error={!!errors.email}
                                                helperText={errors.email?.message as string}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{
                                            pattern: {
                                                value: /^$|^[0-9]{10}$/,
                                                message: 'Phone must be a 10-digit number',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Phone"
                                                fullWidth
                                                size="small"
                                                error={!!errors.phone}
                                                helperText={errors.phone?.message as string}
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
                                                error={!!errors.contactPerson}
                                                helperText={errors.contactPerson?.message as string}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="website"
                                        control={control}
                                        rules={{
                                            pattern: {
                                                value: /^$|^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                                                message: 'Please enter a valid URL',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Website"
                                                fullWidth
                                                size="small"
                                                error={!!errors.website}
                                                helperText={errors.website?.message as string}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="domain"
                                        control={control}
                                        rules={{
                                            pattern: {
                                                value: /^$|^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}$/,
                                                message: 'Please enter a valid domain (e.g. company.com)',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Domain"
                                                fullWidth
                                                size="small"
                                                placeholder="e.g. company.com"
                                                error={!!errors.domain}
                                                helperText={errors.domain?.message as string}
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
                                                error={!!errors.address}
                                                helperText={errors.address?.message as string}
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
                                                error={!!errors.city}
                                                helperText={errors.city?.message as string}
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
                                                error={!!errors.state}
                                                helperText={errors.state?.message as string}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6} sm={4}>
                                    <Controller
                                        name="pincode"
                                        control={control}
                                        rules={{
                                            pattern: {
                                                value: /^$|^[0-9]{6}$/,
                                                message: 'Pincode must be a 6-digit number',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Pincode"
                                                fullWidth
                                                size="small"
                                                error={!!errors.pincode}
                                                helperText={errors.pincode?.message as string}
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

                                {/* Logo Upload */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Logo</Typography>
                                    {existingLogoUrl ? <CustomImage src={existingLogoUrl} style={{ width: '50%', height: 200, objectFit: 'contain', marginBottom: 8 }} /> : null}
                                    <ImageUpload
                                        onChange={(files: any) => {
                                            imageFileRef.current = files?.length ? files[0] : null;
                                            if (files?.length) {
                                                setExistingLogoUrl("");
                                            }
                                        }}
                                        allow="image/*"
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
