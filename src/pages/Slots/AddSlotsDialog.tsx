
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, Grid, IconButton, MenuItem, FormControl, InputLabel, Select, FormHelperText, Divider, Checkbox, FormControlLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import { useSlotStore } from "../../services/slots";
import { ISlot, CreateSlotRequest } from "../../types/slots";
import { useSpecialistStore } from "../../services/specialist";
import { useWellnessPackageStore } from "../../services/wellnessPackages";
import { SLOT_TYPES, RECURRING_PATTERNS } from "./constants";
import { showError } from "../../services/toaster";
import dayjs from "dayjs";

export default function AddSlotsDialog({
    isModalOpen,
    toggleModal,
    selectedId
}: any) {
    const defaultData: Partial<ISlot> = {
        date: dayjs().format('YYYYMMDD'),
        startTime: "09:00",
        endTime: "10:00",
        duration: 60,
        isAvailable: true,
        maxBookings: 1,
        currentBookings: 0,
        slotType: 'consultation',
        isRecurring: false,
        recurringPattern: 'daily',
        isActive: true,
        specialistId: '',
        wellnessPackageId: ''
    }

    const { onCreate, detail, onUpdate } = useSlotStore();
    const { data: specialists, fetchGrid: fetchSpecialists } = useSpecialistStore();
    const { data: wellnessPackages, fetchGrid: fetchWellnessPackages } = useWellnessPackageStore();

    const [slotData, setSlotData] = React.useState<Partial<ISlot>>(defaultData)

    const handleChange = (key: keyof ISlot, value: any) => {
        setSlotData(prev => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }

    const [fieldErrors, setFieldErrors] = React.useState<{ [key: string]: string }>({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateSlotRequest>();

    React.useEffect(() => {
        fetchSpecialists();
        fetchWellnessPackages();
    }, []);

    const handleClickOpen = () => {
        setSlotData(defaultData);
        toggleModal(true);
    };

    const handleClose = () => {
        toggleModal(false);
        setSlotData(defaultData);
    };

    const validateForm = (): boolean => {
        const errs: { [key: string]: string } = {};

        if (!slotData.date) {
            errs.date = 'Date is required';
        }

        if (!slotData.startTime) {
            errs.startTime = 'Start time is required';
        }

        if (!slotData.endTime) {
            errs.endTime = 'End time is required';
        } else if (slotData.startTime && slotData.endTime && slotData.endTime <= slotData.startTime) {
            errs.endTime = 'End time must be after start time';
        }

        if (!slotData.duration || slotData.duration <= 0) {
            errs.duration = 'Duration must be greater than 0';
        } else if (slotData.duration > 480) {
            errs.duration = 'Duration cannot exceed 480 minutes';
        }

        if (!slotData.maxBookings || slotData.maxBookings < 1) {
            errs.maxBookings = 'Max bookings must be at least 1';
        }

        if (slotData.slotType === 'consultation' && !slotData.specialistId) {
            errs.specialistId = 'Please select a specialist';
        }

        if (slotData.slotType === 'wellnessPackage' && !slotData.wellnessPackageId) {
            errs.wellnessPackageId = 'Please select a wellness package';
        }

        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onSubmit = () => {
        if (!validateForm()) {
            showError('Please fix the highlighted errors');
            return;
        }

        // Format date if needed (YYYY-MM-DD to YYYYMMDD)
        const formattedDate = slotData.date ? slotData.date.replace(/-/g, '') : '';

        // Construct payload
        const payload: any = {
            ...slotData,
            date: formattedDate,
            // Ensure specific fields are cleaned based on type
            specialistId: slotData.slotType === 'consultation' ? slotData.specialistId : undefined,
            wellnessPackageId: slotData.slotType === 'wellnessPackage' ? slotData.wellnessPackageId : undefined,
        };

        if (slotData?._id) {
            onUpdate(payload as ISlot);
        } else {
            onCreate(payload as CreateSlotRequest);
        }
        handleClose();
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const data = await detail(selectedId);
            if (data?.data) {
                // Format date for input (YYYYMMDD to YYYY-MM-DD)
                const dateStr = data.data.date;
                const formattedDate = dateStr && dateStr.length === 8
                    ? `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`
                    : dateStr;

                setSlotData({
                    ...data.data,
                    date: formattedDate
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        if (selectedId && isModalOpen) {
            fetchDetail(selectedId)
        } else if (!selectedId && isModalOpen) {
            setSlotData(defaultData);
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
                    Add Slot
                </Button>
            </Stack>

            <Drawer
                anchor="right"
                open={isModalOpen}
                onClose={handleClose}
            >
                <Box sx={{ width: { xs: '100%', sm: 600 }, p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                        <Typography variant="h6">{selectedId ? 'Edit Slot' : 'Add Slot'}</Typography>
                        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>

                                {/* Slot Type */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth margin="dense" size="small">
                                        <InputLabel id="slot-type-label">Slot Type</InputLabel>
                                        <Select
                                            labelId="slot-type-label"
                                            id="slotType"
                                            value={slotData.slotType}
                                            label="Slot Type"
                                            onChange={(e) => handleChange("slotType", e.target.value)}
                                        >
                                            {SLOT_TYPES.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Conditional Fields based on Slot Type */}
                                {slotData.slotType === 'consultation' && (
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin="dense" size="small" error={!!fieldErrors.specialistId}>
                                            <InputLabel id="specialist-label">Specialist</InputLabel>
                                            <Select
                                                labelId="specialist-label"
                                                id="specialistId"
                                                value={slotData.specialistId || ''}
                                                label="Specialist"
                                                onChange={(e) => handleChange("specialistId", e.target.value)}
                                            >
                                                {specialists.map((specialist) => (
                                                    <MenuItem key={specialist._id} value={specialist._id}>
                                                        {specialist.name} ({specialist.specialization})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldErrors.specialistId && (
                                                <FormHelperText>{fieldErrors.specialistId}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                )}

                                {slotData.slotType === 'wellnessPackage' && (
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin="dense" size="small" error={!!fieldErrors.wellnessPackageId}>
                                            <InputLabel id="wellness-package-label">Wellness Package</InputLabel>
                                            <Select
                                                labelId="wellness-package-label"
                                                id="wellnessPackageId"
                                                value={slotData.wellnessPackageId || ''}
                                                label="Wellness Package"
                                                onChange={(e) => handleChange("wellnessPackageId", e.target.value)}
                                            >
                                                {wellnessPackages.map((pkg) => (
                                                    <MenuItem key={pkg._id} value={pkg._id}>
                                                        {pkg.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldErrors.wellnessPackageId && (
                                                <FormHelperText>{fieldErrors.wellnessPackageId}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                )}

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Timing Details</Typography>
                                </Grid>

                                {/* Date */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="date"
                                        label="Date"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        value={slotData.date}
                                        onChange={(e) => handleChange("date", e.target.value)}
                                        error={!!fieldErrors.date}
                                        helperText={fieldErrors.date}
                                    />
                                </Grid>

                                {/* Duration */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="duration"
                                        label="Duration (minutes)"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={slotData.duration}
                                        onChange={(e) => handleChange("duration", Number(e.target.value))}
                                        error={!!fieldErrors.duration}
                                        helperText={fieldErrors.duration}
                                    />
                                </Grid>

                                {/* Start Time */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="startTime"
                                        label="Start Time"
                                        type="time"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        value={slotData.startTime}
                                        onChange={(e) => handleChange("startTime", e.target.value)}
                                        error={!!fieldErrors.startTime}
                                        helperText={fieldErrors.startTime}
                                    />
                                </Grid>

                                {/* End Time */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="endTime"
                                        label="End Time"
                                        type="time"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        value={slotData.endTime}
                                        onChange={(e) => handleChange("endTime", e.target.value)}
                                        error={!!fieldErrors.endTime}
                                        helperText={fieldErrors.endTime}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Availability & recurring</Typography>
                                </Grid>

                                {/* Max Bookings */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="maxBookings"
                                        label="Max Bookings"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={slotData.maxBookings}
                                        onChange={(e) => handleChange("maxBookings", Number(e.target.value))}
                                        error={!!fieldErrors.maxBookings}
                                        helperText={fieldErrors.maxBookings}
                                    />
                                </Grid>

                                {/* Is Available Checkbox */}
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={slotData.isAvailable || false}
                                                onChange={(e) => handleChange("isAvailable", e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="Is Available"
                                    />
                                </Grid>

                                {/* Is Recurring Checkbox */}
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={slotData.isRecurring || false}
                                                onChange={(e) => handleChange("isRecurring", e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="Recurring Slot"
                                    />
                                </Grid>

                                {/* Recurring Pattern */}
                                {slotData.isRecurring && (
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth margin="dense" size="small">
                                            <InputLabel id="recurring-pattern-label">Recurring Pattern</InputLabel>
                                            <Select
                                                labelId="recurring-pattern-label"
                                                id="recurringPattern"
                                                value={slotData.recurringPattern}
                                                label="Recurring Pattern"
                                                onChange={(e) => handleChange("recurringPattern", e.target.value)}
                                            >
                                                {RECURRING_PATTERNS.map((pattern) => (
                                                    <MenuItem key={pattern.value} value={pattern.value}>{pattern.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}

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
