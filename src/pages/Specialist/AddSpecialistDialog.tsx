import AddIcon from "@mui/icons-material/Add";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react';
import { useForm } from "react-hook-form";
import SearchInput from "../../components/SearchInput";

import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { showError } from "../../services/toaster";
import { Specialist } from "../../types/specialist";
import { MODULES } from "../../utils/constants";
import { uploadFile } from "../../utils/helper";
import { useSpecialistStore } from "../../services/specialist";
import { useCompanyStore } from "../../services/company";
import { useCorporateStore } from "../../services/corporates";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialData: Specialist = {
    name: "",
    profilePictureUrl: "",
    rating: 0,
    specialization: "",
    degree: "",
    experienceYears: 0,
    languages: [],
    bio: "",
    consultationFee: 0,
    isConsultationFree: false,
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isActive: true,
    isVerified: false,
};

const AddSpecialistDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate, filters, setFilters } = useSpecialistStore();
    const { globalCompanyId } = useCompanyStore();
    const { data: corporates, fetchGrid: fetchCorporates } = useCorporateStore();
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<Specialist>({
        defaultValues: { ...initialData },
    });
    const [targetType, setTargetType] = React.useState<'all' | 'corporate' | ''>('');

    const isGlobalCorporateSelected = globalCompanyId && globalCompanyId !== "general";

    const imageFileRef = React.useRef<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = React.useState<string>("");

    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    // Filter states
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = (query: string) => {
        const newFilters: any = { ...filters };

        if (query.trim()) {
            const searchTerm = query.trim().toLowerCase();

            // Common specializations to check against
            const SPECIALIZATIONS = [
                'Cardiologist', 'Dermatologist', 'Endocrinologist', 'Gastroenterologist',
                'Neurologist', 'Oncologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist',
                'Radiologist', 'Urologist', 'Gynecologist', 'Surgeon', 'Dentist', 'Physician',
                'Ophthalmologist', 'ENT', 'Pulmonologist', 'Rheumatologist', 'Nephrologist',
                'General Physician', 'Orthopaedics', 'Obstetrics', 'Pathologist'
            ];

            const matchedSpec = SPECIALIZATIONS.find(
                s => s.toLowerCase().includes(searchTerm) || searchTerm.includes(s.toLowerCase())
            );

            if (matchedSpec) {
                // If search term matches a specialization, filter by specialization
                newFilters.specialization = matchedSpec;
                delete newFilters.name;
            } else {
                // Otherwise, perform a regular name search
                newFilters.name = query.trim();
                delete newFilters.specialization;
            }
        } else {
            delete newFilters.name;
            delete newFilters.specialization;
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

    const onSubmit = async (formValues: Specialist) => {
        let profilePictureUrl = existingImageUrl || "";
        if (imageFileRef.current instanceof File) {
            const uploadRes = await uploadFile({ module: MODULES.SPECIALIST }, [imageFileRef.current]);

            if (uploadRes.error) {
                showError(uploadRes.message || 'Failed to upload image');
                return;
            }

            const uploadedFiles = uploadRes.data?.data?.files;
            if (uploadedFiles?.length && uploadedFiles[0]?.url) {
                profilePictureUrl = uploadedFiles[0].url;
            }
        }

        const payload: any = {
            ...formValues,
            profilePictureUrl: profilePictureUrl,
        };

        if (formValues?._id) {
            delete payload.corporate_id;
        } else if (targetType === 'corporate') {
            // Use the manually selected corporate_id, or fall back to globalCompanyId
            payload.corporate_id = formValues.corporate_id || (isGlobalCorporateSelected ? globalCompanyId : undefined);
            if (!payload.corporate_id) {
                delete payload.corporate_id;
            }
        } else {
            delete payload.corporate_id;
        }

        let response = null;
        if (formValues?._id) {
            response = await onUpdate(payload);
        } else {
            response = await onCreate(payload);
        }

        reset({ ...initialData });
        setTargetType('');
        imageFileRef.current = null;
        setExistingImageUrl("");
        handleClose();
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const data = await detail(selectedId);
            reset(data?.data);
            setTargetType(data?.data?.corporate_id ? 'corporate' : 'all');
            if (data?.data?.profilePictureUrl && typeof data.data.profilePictureUrl === 'string') {
                setExistingImageUrl(data.data.profilePictureUrl);
            }
        } catch (error) {

        }
    }

    React.useEffect(() => {
        reset({ ...initialData });
        setTargetType('');
        imageFileRef.current = null;
        setExistingImageUrl("");
        if (selectedId) {
            fetchDetail(selectedId);
        } else {
            // For new specialists, auto-set based on global company selection
            if (isGlobalCorporateSelected) {
                setTargetType('corporate');
                setValue("corporate_id", globalCompanyId);
            } else if (globalCompanyId === "general") {
                setTargetType('all');
            }
        }
    }, [selectedId, globalCompanyId]);

    React.useEffect(() => {
        if (isModalOpen) {
            fetchCorporates();
        }
    }, [isModalOpen, fetchCorporates]);

    const watchedId = watch("_id");
    const watchedCorporateId = watch("corporate_id");
    const watchedIsConsultationFree = watch("isConsultationFree");
    const watchedIsActive = watch("isActive");
    const watchedIsVerified = watch("isVerified");
    const canShowMainForm = Boolean(watchedId) || targetType === 'all' || (targetType === 'corporate' && Boolean(watchedCorporateId));

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <SearchInput handleChange={handleSearchChange} />
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                    Add Specialist
                </Button>
            </Stack>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="lg"
                fullWidth
                sx={{ height: "100%" }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{watchedId ? 'Edit Specialist' : 'Add Specialist'}</DialogTitle>
                    <DialogContent dividers>
                        {!watchedId && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                                    Specialist Scope
                                </Typography>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        value={targetType}
                                        onChange={(e) => {
                                            const nextTarget = e.target.value as 'all' | 'corporate';
                                            setTargetType(nextTarget);
                                            if (nextTarget === 'all') {
                                                setValue("corporate_id", undefined);
                                            }
                                        }}
                                    >
                                        <FormControlLabel value="all" control={<Radio />} label="For All" />
                                        <FormControlLabel value="corporate" control={<Radio />} label="For Corporate" />
                                    </RadioGroup>
                                </FormControl>

                                {targetType === 'corporate' && (
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel id="specialist-corporate-select-label">Select Corporate</InputLabel>
                                        <Select
                                            labelId="specialist-corporate-select-label"
                                            label="Select Corporate"
                                            value={watchedCorporateId ?? ''}
                                            onChange={(e) => setValue("corporate_id", e.target.value)}
                                        >
                                            {corporates.map((corporate) => (
                                                <MenuItem key={corporate._id} value={corporate._id}>
                                                    {corporate.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </Box>
                        )}

                        {canShowMainForm && (
                            <>

                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="Name"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("name", {
                                            required: 'Name is required',
                                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                        })}
                                        error={!!errors.name}
                                        helperText={errors.name?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="specialization"
                                        label="Specialization"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("specialization", {
                                            required: 'Specialization is required',
                                        })}
                                        error={!!errors.specialization}
                                        helperText={errors.specialization?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="dense"
                                        id="degree"
                                        label="Degree"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("degree", {
                                            required: 'Degree is required',
                                        })}
                                        error={!!errors.degree}
                                        helperText={errors.degree?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="experienceYears"
                                        label="Experience (Years)"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        {...register("experienceYears", {
                                            valueAsNumber: true,
                                            required: 'Experience is required',
                                            min: { value: 0, message: 'Experience cannot be negative' },
                                            max: { value: 70, message: 'Experience cannot exceed 70 years' },
                                        })}
                                        error={!!errors.experienceYears}
                                        helperText={errors.experienceYears?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Stack>

                                <TextField
                                    margin="dense"
                                    id="bio"
                                    label="Bio"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    {...register("bio")}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="dense"
                                        id="email"
                                        label="Email"
                                        type="email"
                                        fullWidth
                                        variant="outlined"
                                        {...register("email", {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Please enter a valid email address',
                                            },
                                        })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="phone"
                                        label="Phone"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("phone", {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Phone must be a 10-digit number',
                                            },
                                        })}
                                        error={!!errors.phone}
                                        helperText={errors.phone?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="dense"
                                        id="consultationFee"
                                        label="Consultation Fee"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        {...register("consultationFee", {
                                            valueAsNumber: true,
                                            required: 'Consultation fee is required',
                                            min: { value: 0, message: 'Fee cannot be negative' },
                                        })}
                                        error={!!errors.consultationFee}
                                        helperText={errors.consultationFee?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />

                                    <TextField
                                        margin="dense"
                                        id="rating"
                                        label="Rating"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        {...register("rating", {
                                            valueAsNumber: true,
                                            min: { value: 0, message: 'Rating must be at least 0' },
                                            max: { value: 5, message: 'Rating cannot exceed 5' },
                                        })}
                                        error={!!errors.rating}
                                        helperText={errors.rating?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="dense"
                                        id="address"
                                        label="Address"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("address", {
                                            required: 'Address is required',
                                        })}
                                        error={!!errors.address}
                                        helperText={errors.address?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="city"
                                        label="City"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("city", {
                                            required: 'City is required',
                                        })}
                                        error={!!errors.city}
                                        helperText={errors.city?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <TextField
                                        margin="dense"
                                        id="state"
                                        label="State"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("state", {
                                            required: 'State is required',
                                        })}
                                        error={!!errors.state}
                                        helperText={errors.state?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="pincode"
                                        label="Pincode"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        {...register("pincode", {
                                            required: 'Pincode is required',
                                            pattern: {
                                                value: /^[0-9]{6}$/,
                                                message: 'Pincode must be a 6-digit number',
                                            },
                                        })}
                                        error={!!errors.pincode}
                                        helperText={errors.pincode?.message as string}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={watchedIsConsultationFree ?? false}
                                                onChange={(e) => setValue("isConsultationFree", e.target.checked)}
                                            />
                                        }
                                        label="Free Consultation"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={watchedIsActive ?? true}
                                                onChange={(e) => setValue("isActive", e.target.checked)}
                                            />
                                        }
                                        label="Active"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={watchedIsVerified ?? false}
                                                onChange={(e) => setValue("isVerified", e.target.checked)}
                                            />
                                        }
                                        label="Verified"
                                    />
                                </Stack>

                                {existingImageUrl ? <CustomImage src={existingImageUrl} style={{ width: '50%', height: 200, objectFit: 'contain', marginTop: 16 }} /> : null}
                                <ImageUpload
                                    onChange={(files: any) => {
                                        imageFileRef.current = files?.length ? files[0] : null;
                                        if (files?.length) {
                                            setExistingImageUrl("");
                                        }
                                    }}
                                    allow="image/*"
                                />
                            </>
                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </>
    )
}

export default AddSpecialistDialog
