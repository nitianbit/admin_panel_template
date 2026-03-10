import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Stack,
    FormControlLabel,
    Switch,
    Typography,
    Box,
    MenuItem,
} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { uploadFile } from "../../utils/helper";
import { MODULES } from "../../utils/constants";
import { showError } from "../../services/toaster";
import { usePartnerStore } from "../../services/partners";
import { useCompanyStore } from "../../services/company";
import { PartnerData } from "../../types/partners";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddPartnerDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, onUpdate, detail, fetchGrid, filters, setFilters } = usePartnerStore();
    const { globalCompanyId } = useCompanyStore();

    const imageFileRef = React.useRef<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = React.useState<string>("");

    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<PartnerData>({
        defaultValues: {
            isActive: true,
            isVerified: false,
            partnerType: 'hospital',
            order: 0
        }
    });

    const handleClose = () => {
        toggleModal(false);
        reset();
        imageFileRef.current = null;
        setExistingImageUrl("");
    };

    // Filter states
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = (query: string) => {
        const newFilters: any = { ...filters };

        if (query.trim()) {
            const searchTerm = query.trim().toLowerCase();

            // Common locations to check against
            const LOCATIONS = [
                'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
                'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
                'Indore', 'Thane', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
                'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi', 'Srinagar',
                'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi',
                'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
                'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Noida', 'Gurugram'
            ];

            const matchedLocation = LOCATIONS.find(
                l => l.toLowerCase().includes(searchTerm) || searchTerm.includes(l.toLowerCase())
            );

            if (matchedLocation) {
                // If search term matches a known location, filter by city
                newFilters.city = matchedLocation;
                delete newFilters.name;
            } else {
                // Otherwise, perform a regular name search
                newFilters.name = query.trim();
                delete newFilters.city;
            }
        } else {
            delete newFilters.name;
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

    const onSubmit = async (data: PartnerData) => {
        try {
            // Upload image first if a new file is selected
            let logoUrl = existingImageUrl || "";
            if (imageFileRef.current instanceof File) {
                const uploadRes = await uploadFile({ module: MODULES.PARTNER }, [imageFileRef.current]);
                if (uploadRes.error) {
                    showError(uploadRes.message || 'Failed to upload image');
                    return;
                }
                const uploadedFiles = uploadRes.data?.data?.files;
                if (uploadedFiles?.length && uploadedFiles[0]?.url) {
                    logoUrl = uploadedFiles[0].url;
                }
            }

            const payload: PartnerData = {
                ...data,
                ...(logoUrl && { logoUrl }),
                corporateId: globalCompanyId,
            };

            let response: PartnerData | null = null;
            if (selectedId) {
                payload._id = selectedId;
                response = await onUpdate(payload);
            } else {
                response = await onCreate(payload);
            }

            if (response) {
                handleClose();
            }
        } catch (error) {
            console.error("Error saving partner:", error);
            showError("Failed to save partner");
        }
    };

    React.useEffect(() => {
        if (isModalOpen && selectedId) {
            detail(selectedId).then(res => {
                if (res.data) {
                    reset(res.data);
                    if (res.data.logoUrl && typeof res.data.logoUrl === 'string') {
                        setExistingImageUrl(res.data.logoUrl);
                    }
                }
            });
        } else if (isModalOpen) {
            reset({
                isActive: true,
                isVerified: false,
                partnerType: 'hospital',
                order: 0,
                name: "",
                email: "",
                phone: "",
                website: "",
                description: "",
                address: "",
                city: "",
                state: "",
                pincode: ""
            });
            imageFileRef.current = null;
            setExistingImageUrl("");
        }
    }, [selectedId, isModalOpen]);

    const handleClickOpen = () => toggleModal(true);

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <SearchInput handleChange={handleSearchChange} />
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                    Add Partner
                </Button>
            </Stack>
            <Dialog open={isModalOpen} onClose={handleClose} TransitionComponent={Transition} fullWidth maxWidth="md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{selectedId ? "Edit Partner" : "Add New Partner"}</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={2} alignItems="center">
                                    <Box sx={{ width: 150, height: 150, border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 1, overflow: 'hidden' }}>
                                        {existingImageUrl ? (
                                            <CustomImage src={existingImageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Typography variant="caption">Partner Logo</Typography>
                                        )}
                                    </Box>
                                    <ImageUpload
                                        onChange={(files: any) => {
                                            if (files?.length) {
                                                imageFileRef.current = files[0];
                                                setExistingImageUrl(URL.createObjectURL(files[0]));
                                            }
                                        }}
                                        allow="image/*"
                                        multiple={false}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Partner Name"
                                            fullWidth
                                            {...register("name", {
                                                required: "Name is required",
                                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                                            })}
                                            error={!!errors.name}
                                            helperText={errors.name?.message as string}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            select
                                            label="Partner Type"
                                            fullWidth
                                            {...register("partnerType")}
                                            error={!!errors.partnerType}
                                            helperText={errors.partnerType?.message as string}
                                        >
                                            <MenuItem value="hospital">Hospital</MenuItem>
                                            <MenuItem value="lab">Laboratory</MenuItem>
                                            <MenuItem value="clinic">Clinic</MenuItem>
                                            <MenuItem value="pharmacy">Pharmacy</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Website URL"
                                            fullWidth
                                            {...register("website", {
                                                pattern: {
                                                    value: /^$|^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                                                    message: "Please enter a valid URL",
                                                },
                                            })}
                                            error={!!errors.website}
                                            helperText={errors.website?.message as string}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            {...register("email", {
                                                pattern: {
                                                    value: /^$|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Please enter a valid email address",
                                                },
                                            })}
                                            error={!!errors.email}
                                            helperText={errors.email?.message as string}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Phone"
                                            fullWidth
                                            {...register("phone", {
                                                pattern: {
                                                    value: /^$|^[0-9]{10}$/,
                                                    message: "Phone must be a 10-digit number",
                                                },
                                            })}
                                            error={!!errors.phone}
                                            helperText={errors.phone?.message as string}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    {...register("description")}
                                    error={!!errors.description}
                                    helperText={errors.description?.message as string}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Address"
                                    fullWidth
                                    {...register("address")}
                                    error={!!errors.address}
                                    helperText={errors.address?.message as string}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="City"
                                    fullWidth
                                    {...register("city")}
                                    error={!!errors.city}
                                    helperText={errors.city?.message as string}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="State"
                                    fullWidth
                                    {...register("state")}
                                    error={!!errors.state}
                                    helperText={errors.state?.message as string}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Pincode"
                                    fullWidth
                                    {...register("pincode", {
                                        pattern: {
                                            value: /^$|^[0-9]{6}$/,
                                            message: "Pincode must be a 6-digit number",
                                        },
                                    })}
                                    error={!!errors.pincode}
                                    helperText={errors.pincode?.message as string}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Order"
                                    type="number"
                                    fullWidth
                                    {...register("order", {
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Order must be 0 or greater" },
                                    })}
                                    error={!!errors.order}
                                    helperText={errors.order?.message as string}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={3}>
                                    <FormControlLabel
                                        control={<Controller name="isActive" control={control} render={({ field }) => (
                                            <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                        )} />}
                                        label="Active"
                                    />
                                    <FormControlLabel
                                        control={<Controller name="isVerified" control={control} render={({ field }) => (
                                            <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                        )} />}
                                        label="Verified"
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {selectedId ? "Update Partner" : "Add Partner"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddPartnerDialog;

