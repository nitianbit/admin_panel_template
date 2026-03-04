
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, Grid, IconButton, MenuItem, FormControl, InputLabel, Select, FormHelperText, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { useForm, Controller } from "react-hook-form";
import { useBookingStore } from "../../services/bookings";
import { useSlotStore } from "../../services/slots";
import { CreateWellnessPackageBookingRequest, CreateSpecialistBookingRequest, UpdateBookingRequest, IBooking } from "../../types/bookings";
import { ISlot } from "../../types/slots";
import { BOOKING_TYPES, SERVICE_MODES, CONSULTATION_MODES, BOOKING_STATUSES, PAYMENT_STATUSES } from "./constants";
import dayjs from "dayjs";

export default function AddBookingDialog({
    isModalOpen,
    toggleModal,
    selectedId
}: any) {
    const { onCreateSpecialist, onCreateWellnessPackage, detail, onUpdate } = useBookingStore();
    const { fetchBySpecialist, fetchByWellnessPackage } = useSlotStore();
    const [bookingType, setBookingType] = React.useState<'package' | 'consultation'>('package');
    const [availableSlots, setAvailableSlots] = React.useState<ISlot[]>([]);
    const [loadingSlots, setLoadingSlots] = React.useState(false);

    const defaultValues = {
        bookingType: 'package',
        bookingDate: dayjs().format('YYYY-MM-DD'),
        bookingTime: "09:00",
        serviceMode: 'in-person',
        status: 'pending',
        paymentStatus: 'pending',
        price: 0,
        documents: [],
        slotId: '',
    };

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<any>({
        defaultValues: defaultValues
    });

    const watchedBookingType = watch('bookingType');
    const watchedSpecialistId = watch('specialistId');
    const watchedWellnessPackageId = watch('wellnessPackageId');

    React.useEffect(() => {
        setBookingType(watchedBookingType);
        // Clear slots and slotId when booking type changes
        setAvailableSlots([]);
        setValue('slotId', '');
    }, [watchedBookingType]);

    // Fetch available slots when specialistId changes (for consultation type)
    React.useEffect(() => {
        if (bookingType === 'consultation' && watchedSpecialistId && !selectedId) {
            const fetchSlots = async () => {
                setLoadingSlots(true);
                try {
                    const slots = await fetchBySpecialist(watchedSpecialistId);
                    setAvailableSlots(Array.isArray(slots) ? slots : []);
                } catch (error) {
                    console.error('Failed to fetch slots for specialist', error);
                    setAvailableSlots([]);
                } finally {
                    setLoadingSlots(false);
                }
            };
            fetchSlots();
            setValue('slotId', '');
        }
    }, [watchedSpecialistId, bookingType]);

    // Fetch available slots when wellnessPackageId changes (for package type)
    React.useEffect(() => {
        if (bookingType === 'package' && watchedWellnessPackageId && !selectedId) {
            const fetchSlots = async () => {
                setLoadingSlots(true);
                try {
                    const slots = await fetchByWellnessPackage(watchedWellnessPackageId);
                    setAvailableSlots(Array.isArray(slots) ? slots : []);
                } catch (error) {
                    console.error('Failed to fetch slots for wellness package', error);
                    setAvailableSlots([]);
                } finally {
                    setLoadingSlots(false);
                }
            };
            fetchSlots();
            setValue('slotId', '');
        }
    }, [watchedWellnessPackageId, bookingType]);

    // Auto-fill bookingDate and bookingTime when a slot is selected
    const watchedSlotId = watch('slotId');
    React.useEffect(() => {
        if (watchedSlotId && availableSlots.length > 0) {
            const selectedSlot = availableSlots.find(s => s._id === watchedSlotId);
            if (selectedSlot) {
                // Convert slot date YYYYMMDD to YYYY-MM-DD for the date input
                const slotDate = selectedSlot.date;
                if (slotDate && slotDate.length === 8) {
                    const formatted = `${slotDate.substring(0, 4)}-${slotDate.substring(4, 6)}-${slotDate.substring(6, 8)}`;
                    setValue('bookingDate', formatted);
                }
                if (selectedSlot.startTime) {
                    setValue('bookingTime', selectedSlot.startTime);
                }
            }
        }
    }, [watchedSlotId, availableSlots]);


    const handleClickOpen = () => {
        reset(defaultValues);
        setAvailableSlots([]);
        toggleModal(true);
    };

    const handleClose = () => {
        toggleModal(false);
        reset(defaultValues);
        setAvailableSlots([]);
    };

    const onSubmit = (data: any) => {
        const formattedDate = data.bookingDate ? data.bookingDate.replace(/-/g, '') : '';

        const payload: any = {
            ...data,
            bookingDate: formattedDate,
            price: Number(data.price),
        };

        if (selectedId) {
            const updatePayload: UpdateBookingRequest = {
                corporateId: payload.corporateId,
                bookingDate: payload.bookingDate,
                bookingTime: payload.bookingTime,
                serviceMode: payload.serviceMode,
                serviceAddress: payload.serviceAddress,
                documents: payload.documents,
                primaryConcern: payload.primaryConcern,
                consultationMode: payload.consultationMode,
                contactNo: payload.contactNo,
                alternateContactNo: payload.alternateContactNo,
                status: payload.status,
                paymentStatus: payload.paymentStatus,
                notes: payload.notes,
                cancellationReason: payload.cancellationReason
            };
            onUpdate(selectedId, updatePayload);
        } else {
            if (bookingType === 'package') {
                onCreateWellnessPackage(payload as CreateWellnessPackageBookingRequest);
            } else {
                onCreateSpecialist(payload as CreateSpecialistBookingRequest);
            }
        }
        handleClose();
    };

    const fetchDetail = async (id: string) => {
        try {
            const response = await detail(id);
            if (response?.data) {
                const data = response.data;
                const date = data.bookingDate;
                const formattedDate = date && date.length === 8
                    ? `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`
                    : date;

                reset({
                    ...data,
                    bookingDate: formattedDate,
                });
                setBookingType(data.bookingType);
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

    // Helper to format slot display label
    const formatSlotLabel = (slot: ISlot) => {
        const date = slot.date && slot.date.length === 8
            ? `${slot.date.substring(0, 4)}-${slot.date.substring(4, 6)}-${slot.date.substring(6, 8)}`
            : slot.date;
        return `${date} | ${slot.startTime} - ${slot.endTime}${slot.isAvailable === false ? ' (Booked)' : ''}`;
    };

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
                    Add Booking
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
                        <Typography variant="h6">{selectedId ? 'Edit Booking' : 'Add Booking'}</Typography>
                        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                {/* Core Booking Details */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Booking Details</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="bookingType"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small" disabled={!!selectedId}>
                                                <InputLabel>Booking Type</InputLabel>
                                                <Select {...field} label="Booking Type">
                                                    {BOOKING_TYPES.map((type) => (
                                                        <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="userId"
                                        control={control}
                                        rules={{ required: 'User ID is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="User ID"
                                                fullWidth
                                                size="small"
                                                error={!!errors.userId}
                                                helperText={errors.userId?.message as string}
                                                disabled={!!selectedId}
                                            />
                                        )}
                                    />
                                </Grid>

                                {bookingType === 'package' && (
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="wellnessPackageId"
                                            control={control}
                                            rules={{ required: 'Package ID is required' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Wellness Package ID"
                                                    fullWidth
                                                    size="small"
                                                    error={!!errors.wellnessPackageId}
                                                    helperText={errors.wellnessPackageId?.message as string}
                                                    disabled={!!selectedId}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}

                                {bookingType === 'consultation' && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="specialistId"
                                                control={control}
                                                rules={{ required: 'Specialist ID is required' }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Specialist ID"
                                                        fullWidth
                                                        size="small"
                                                        error={!!errors.specialistId}
                                                        helperText={errors.specialistId?.message as string}
                                                        disabled={!!selectedId}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name="primaryConcern"
                                                control={control}
                                                rules={{ required: 'Primary Concern is required' }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Primary Concern"
                                                        fullWidth
                                                        multiline
                                                        rows={2}
                                                        size="small"
                                                        error={!!errors.primaryConcern}
                                                        helperText={errors.primaryConcern?.message as string}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="consultationMode"
                                                control={control}
                                                rules={{ required: 'Consultation Mode is required' }}
                                                render={({ field }) => (
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Consultation Mode</InputLabel>
                                                        <Select {...field} label="Consultation Mode">
                                                            {CONSULTATION_MODES.map((mode) => (
                                                                <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* Slot Selection */}
                                {!selectedId && (
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="slotId"
                                            control={control}
                                            rules={{ required: 'Slot is required' }}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!!errors.slotId}>
                                                    <InputLabel>Select Slot</InputLabel>
                                                    <Select
                                                        {...field}
                                                        label="Select Slot"
                                                        disabled={loadingSlots || availableSlots.length === 0}
                                                        endAdornment={loadingSlots ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
                                                    >
                                                        {availableSlots.length === 0 && !loadingSlots && (
                                                            <MenuItem disabled value="">
                                                                {(bookingType === 'consultation' && !watchedSpecialistId) || (bookingType === 'package' && !watchedWellnessPackageId)
                                                                    ? `Enter ${bookingType === 'consultation' ? 'Specialist' : 'Package'} ID first`
                                                                    : 'No slots available'}
                                                            </MenuItem>
                                                        )}
                                                        {availableSlots.map((slot) => (
                                                            <MenuItem
                                                                key={slot._id}
                                                                value={slot._id}
                                                                disabled={slot.isAvailable === false}
                                                            >
                                                                {formatSlotLabel(slot)}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {errors.slotId && (
                                                        <FormHelperText>{errors.slotId?.message as string}</FormHelperText>
                                                    )}
                                                    {!loadingSlots && availableSlots.length === 0 && (
                                                        (bookingType === 'consultation' && watchedSpecialistId) ||
                                                        (bookingType === 'package' && watchedWellnessPackageId)
                                                    ) && (
                                                            <FormHelperText>No available slots found. Create a slot first.</FormHelperText>
                                                        )}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                )}

                                {/* Schedule */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>Schedule & Service</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="bookingDate"
                                        control={control}
                                        rules={{ required: 'Date is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="date"
                                                label="Booking Date"
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.bookingDate}
                                                helperText={errors.bookingDate?.message as string}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="bookingTime"
                                        control={control}
                                        rules={{ required: 'Time is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="time"
                                                label="Booking Time"
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.bookingTime}
                                                helperText={errors.bookingTime?.message as string}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="serviceMode"
                                        control={control}
                                        rules={{ required: 'Service Mode is required' }}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Service Mode</InputLabel>
                                                <Select {...field} label="Service Mode">
                                                    {SERVICE_MODES.map((mode) => (
                                                        <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                {/* Contact Info */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>Contact Information</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="contactNo"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Contact No"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="alternateContactNo"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Alt Contact No"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Address - Only if relevant modes */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>Service Address</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="serviceAddress.addressLine"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Address Line"
                                                fullWidth
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Controller
                                        name="serviceAddress.city"
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
                                        name="serviceAddress.state"
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
                                <Grid item xs={12} sm={4}>
                                    <Controller
                                        name="serviceAddress.pincode"
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


                                {/* Status & Meta */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 2, fontWeight: 'bold' }}>Status & Payment</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Booking Status</InputLabel>
                                                <Select {...field} label="Booking Status">
                                                    {BOOKING_STATUSES.map((status) => (
                                                        <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="paymentStatus"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Payment Status</InputLabel>
                                                <Select {...field} label="Payment Status">
                                                    {PAYMENT_STATUSES.map((status) => (
                                                        <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="notes"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Notes"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                {selectedId && (
                                    <Grid item xs={12}>
                                        <Controller
                                            name="cancellationReason"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Cancellation Reason"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    size="small"
                                                />
                                            )}
                                        />
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
