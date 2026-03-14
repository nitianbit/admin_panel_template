
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, Grid, IconButton, MenuItem, FormControl, InputLabel, Select, FormHelperText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { useForm, Controller } from "react-hook-form";
import { useBookingStore } from "../../services/bookings";
import { useSlotStore } from "../../services/slots";
import { CreateWellnessPackageBookingRequest, CreateSpecialistBookingRequest, UpdateBookingRequest, IDocument, IServiceAddress } from "../../types/bookings";
import { ISlot } from "../../types/slots";
import { WellnessPackage } from "../../types/WellnessPackage";
import { Specialist } from "../../types/specialist";
import { BOOKING_TYPES, SERVICE_MODES, CONSULTATION_MODES, BOOKING_STATUSES, PAYMENT_STATUSES } from "./constants";
import dayjs from "dayjs";
import { doGET } from "../../utils/HttpUtils";
import { showError } from "../../services/toaster";
import PaginatedSearchDropdown, { PaginatedOption } from "../../components/PaginatedSearchDropdown";
import { useSurgeryStore } from "../../services/surgery";
import { useSecondOpinionStore } from "../../services/secondOpinion";
import { useSpecialistStore } from "../../services/specialist";
import { useWellnessPackageStore } from "../../services/wellnessPackages";

interface BookingFormValues {
    bookingType: 'package' | 'consultation' | 'surgery' | 'second-opinion';
    bookingDate: string;
    bookingTime: string;
    serviceMode: string;
    status: string;
    paymentStatus: string;
    price: number;
    documents: IDocument[];
    slotId: string;
    userId?: string;
    dependentId?: string;
    corporateId?: string;
    wellnessPackageId?: string;
    specialistId?: string;
    primaryConcern?: string;
    consultationMode?: string;
    contactNo?: string;
    alternateContactNo?: string;
    serviceAddress?: IServiceAddress;
    notes?: string;
    cancellationReason?: string;
    [key: string]: any;
}

export default function AddBookingDialog({
    isModalOpen,
    toggleModal,
    selectedId
}: any) {
    const { onCreateSpecialist, onCreateWellnessPackage, detail, onUpdate, filters, setFilters, data: bookingsList } = useBookingStore();
    const { fetchBySpecialist, fetchByWellnessPackage } = useSlotStore();
    const { onCreate: onCreateSurgery, data: surgeries, fetchGrid: fetchSurgeries } = useSurgeryStore();
    const { onCreate: onCreateSecondOpinion, data: secondOpinions, fetchGrid: fetchSecondOpinions } = useSecondOpinionStore();
    const { data: specialists, fetchGrid: fetchSpecialists } = useSpecialistStore();
    const { data: wellnessPackages, fetchGrid: fetchWellnessPackages } = useWellnessPackageStore();

    React.useEffect(() => {
        fetchSpecialists();
        fetchWellnessPackages();
        fetchSurgeries();
        fetchSecondOpinions();
    }, []);

    const [bookingType, setBookingType] = React.useState<'package' | 'consultation' | 'surgery' | 'second-opinion'>('package');
    const [availableSlots, setAvailableSlots] = React.useState<ISlot[]>([]);
    const [loadingSlots, setLoadingSlots] = React.useState(false);
    const [bookingScope, setBookingScope] = React.useState<'general' | 'corporate' | ''>('');
    const corporatePackagesCacheRef = React.useRef<Record<string, WellnessPackage[]>>({});
    const corporateSpecialistsCacheRef = React.useRef<Record<string, Specialist[]>>({});

    const defaultValues: BookingFormValues = {
        bookingScope: '',
        bookingType: 'package' as const,
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
    } = useForm<BookingFormValues>({
        defaultValues: defaultValues
    });

    const watchedBookingType = watch('bookingType');
    const watchedCorporateId = watch('corporateId');
    const watchedSpecialistId = watch('specialistId');
    const watchedWellnessPackageId = watch('wellnessPackageId');
    const canOpenCreateForm = Boolean(selectedId) || bookingScope === 'general' || (bookingScope === 'corporate' && Boolean(watchedCorporateId));
    const isSlotPrerequisiteSelected =
        bookingType === 'consultation'
            ? Boolean(watchedSpecialistId)
            : bookingType === 'package'
                ? Boolean(watchedWellnessPackageId)
                : true; // surgery and second-opinion don't need slots
    const mapToOption = (value?: string, label?: string): PaginatedOption | null => {
        if (!value) return null;
        return {
            value,
            label: label || value,
        };
    };

    const fetchCorporatePackages = React.useCallback(async (corporateId: string) => {
        if (!corporateId) return [];
        if (corporatePackagesCacheRef.current[corporateId]) {
            return corporatePackagesCacheRef.current[corporateId];
        }
        const response = await doGET(`/corporates/${corporateId}/wellness-packages`);
        const rows = response?.data?.data;
        const packages = Array.isArray(rows) ? rows : [];
        corporatePackagesCacheRef.current[corporateId] = packages;
        return packages;
    }, []);

    const fetchCorporateSpecialists = React.useCallback(async (corporateId: string) => {
        if (!corporateId) return [];
        if (corporateSpecialistsCacheRef.current[corporateId]) {
            return corporateSpecialistsCacheRef.current[corporateId];
        }
        const response = await doGET(`/corporates/${corporateId}/specialists`);
        const rows = response?.data?.data;
        const specialists = Array.isArray(rows) ? rows : [];
        corporateSpecialistsCacheRef.current[corporateId] = specialists;
        return specialists;
    }, []);

    const fetchCorporateOptions = React.useCallback(async ({ page, limit, search }: { page: number; limit: number; search: string; }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        if (search) params.append("search", search);

        const response = await doGET(`/corporates?${params.toString()}`);
        const rows = response?.data?.data;
        const pagination = response?.data?.pagination;
        const corporates = Array.isArray(rows) ? rows : [];
        const options = corporates
            .map((item: any) => mapToOption(item?._id, item?.name))
            .filter(Boolean) as PaginatedOption[];
        const hasMore = pagination?.totalPages ? page < pagination.totalPages : corporates.length === limit;
        return { options, hasMore };
    }, []);

    const fetchUserOptions = React.useCallback(async ({ page, limit, search }: { page: number; limit: number; search: string; }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        params.append("userType", "user");
        if (search) params.append("name", search);
        if (bookingScope === "corporate" && watchedCorporateId) {
            params.append("corporateId", watchedCorporateId);
        }

        const response = await doGET(`/users?${params.toString()}`);
        const rows = response?.data?.data?.users ?? response?.data?.data ?? [];
        const users = Array.isArray(rows) ? rows : [];
        const options = users
            .map((item: any) => mapToOption(item?._id, item?.name || item?.email || item?.phone))
            .filter(Boolean) as PaginatedOption[];
        const hasMore = users.length === limit;
        return { options, hasMore };
    }, [bookingScope, watchedCorporateId]);

    const fetchPackageOptions = React.useCallback(async ({ page, limit, search }: { page: number; limit: number; search: string; }) => {
        if (bookingScope === "corporate" && watchedCorporateId) {
            const corporatePackages = await fetchCorporatePackages(watchedCorporateId);
            const filtered = corporatePackages.filter((item) =>
                (item.name || "").toLowerCase().includes(search.toLowerCase())
            );
            const start = (page - 1) * limit;
            const paginated = filtered.slice(start, start + limit);
            const options = paginated
                .map((item) => mapToOption(item?._id, item?.name))
                .filter(Boolean) as PaginatedOption[];
            return { options, hasMore: start + limit < filtered.length };
        }

        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        if (search) params.append("search", search);

        const response = await doGET(`/wellness-packages?${params.toString()}`);
        const rows = response?.data?.data;
        const pagination = response?.data?.pagination;
        const packages = Array.isArray(rows) ? rows : [];
        const options = packages
            .map((item: any) => mapToOption(item?._id, item?.name))
            .filter(Boolean) as PaginatedOption[];
        const hasMore = pagination?.totalPages ? page < pagination.totalPages : packages.length === limit;
        return { options, hasMore };
    }, [bookingScope, watchedCorporateId, fetchCorporatePackages]);

    const fetchSpecialistOptions = React.useCallback(async ({ page, limit, search }: { page: number; limit: number; search: string; }) => {
        if (bookingScope === "corporate" && watchedCorporateId) {
            const corporateSpecialists = await fetchCorporateSpecialists(watchedCorporateId);
            const filtered = corporateSpecialists.filter((item) => {
                const title = `${item.name || ""} ${item.specialization || ""}`.toLowerCase();
                return title.includes(search.toLowerCase());
            });
            const start = (page - 1) * limit;
            const paginated = filtered.slice(start, start + limit);
            const options = paginated
                .map((item) => mapToOption(item?._id, `${item?.name || "Unknown"}${item?.specialization ? ` (${item.specialization})` : ""}`))
                .filter(Boolean) as PaginatedOption[];
            return { options, hasMore: start + limit < filtered.length };
        }

        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        if (search) params.append("search", search);

        const response = await doGET(`/specialists?${params.toString()}`);
        const rows = response?.data?.data;
        const pagination = response?.data?.pagination;
        const specialists = Array.isArray(rows) ? rows : [];
        const options = specialists
            .map((item: any) => mapToOption(item?._id, `${item?.name || "Unknown"}${item?.specialization ? ` (${item.specialization})` : ""}`))
            .filter(Boolean) as PaginatedOption[];
        const hasMore = pagination?.totalPages ? page < pagination.totalPages : specialists.length === limit;
        return { options, hasMore };
    }, [bookingScope, watchedCorporateId, fetchCorporateSpecialists]);

    const fetchSlotOptions = React.useCallback(async ({ page, limit, search }: { page: number; limit: number; search: string; }) => {
        const filteredSlots = availableSlots.filter((slot) => {
            const label = formatSlotLabel(slot).toLowerCase();
            return label.includes(search.toLowerCase());
        });
        const start = (page - 1) * limit;
        const paginated = filteredSlots.slice(start, start + limit);
        const options = paginated.map((slot) => ({
            value: slot._id || "",
            label: formatSlotLabel(slot),
        }));
        return {
            options,
            hasMore: start + limit < filteredSlots.length,
        };
    }, [availableSlots]);

    React.useEffect(() => {
        setBookingType(watchedBookingType);
        // Clear slots and slotId when booking type changes
        setAvailableSlots([]);
        setValue('slotId', '');
    }, [watchedBookingType]);

    React.useEffect(() => {
        if (!isModalOpen || selectedId) return;

        setValue('userId', '');
        setValue('wellnessPackageId', '');
        setValue('specialistId', '');
        setValue('slotId', '');
        setAvailableSlots([]);

        if (bookingScope === 'general') {
            setValue('corporateId', undefined);
        }
    }, [bookingScope, watchedCorporateId, isModalOpen, selectedId, setValue]);

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
        setBookingScope('');
        setAvailableSlots([]);
        toggleModal(true);
    };

    const handleClose = () => {
        toggleModal(false);
        reset(defaultValues);
        setBookingScope('');
        setAvailableSlots([]);
    };

    const onSubmit = (data: any) => {
        if (!selectedId && !bookingScope) {
            showError('Please select booking scope');
            return;
        }

        if (!selectedId && bookingScope === 'corporate' && !data.corporateId) {
            showError('Please select corporate for corporate booking');
            return;
        }

        const formattedDate = data.bookingDate ? data.bookingDate.replace(/-/g, '') : '';

        const payload: any = {
            ...data,
            bookingDate: formattedDate,
            price: Number(data.price),
        };
        delete payload.bookingScope;

        if (selectedId) {
            delete payload.userId;
            delete payload.wellnessPackageId;
            delete payload.specialistId;
        } else if (bookingScope === 'general') {
            delete payload.corporateId;
        }

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
            } else if (bookingType === 'consultation') {
                onCreateSpecialist(payload as CreateSpecialistBookingRequest);
            } else if (bookingType === 'surgery') {
                const surgeryPayload = {
                    full_name: payload.full_name || '',
                    email: payload.email || '',
                    concern: payload.primaryConcern || payload.concern || '',
                    speciality: payload.speciality || '',
                    medical_record: payload.medical_record || [],
                };
                onCreateSurgery(surgeryPayload);
            } else if (bookingType === 'second-opinion') {
                const secondOpinionPayload = {
                    full_name: payload.full_name || '',
                    email: payload.email || '',
                    concern: payload.primaryConcern || payload.concern || '',
                    medical_record: payload.medical_record || [],
                };
                onCreateSecondOpinion(secondOpinionPayload);
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
            setBookingScope('');
        }
    }, [selectedId, isModalOpen, reset]);

    // Helper to format slot display label
    const formatSlotLabel = (slot: ISlot) => {
        const date = slot.date && slot.date.length === 8
            ? `${slot.date.substring(0, 4)}-${slot.date.substring(4, 6)}-${slot.date.substring(6, 8)}`
            : slot.date;
        return `${date} | ${slot.startTime} - ${slot.endTime}${slot.isAvailable === false ? ' (Booked)' : ''}`;
    };

    const uniqueDates = React.useMemo(() => {
        const dateSet = new Set<string>();
        const source = bookingsList || [];
        source.forEach((s: any) => { if (s.bookingDate) dateSet.add(s.bookingDate); });
        if ((filters as any).bookingDate) dateSet.add((filters as any).bookingDate as string);
        return Array.from(dateSet).sort();
    }, [bookingsList, (filters as any).bookingDate]);

    const uniqueTimes = React.useMemo(() => {
        const sourceData = bookingsList || [];
        const filteredByDate = (filters as any).bookingDate 
            ? sourceData.filter((s: any) => s.bookingDate === (filters as any).bookingDate)
            : sourceData;

        const timeSet = new Set<string>();
        filteredByDate.forEach((s: any) => { if (s.bookingTime) timeSet.add(s.bookingTime); });
        // Always ensure selected time is in the list
        const currentStartTime = (filters as any).bookingTime;
        if (currentStartTime) timeSet.add(currentStartTime);
        return Array.from(timeSet).sort();
    }, [bookingsList, (filters as any).bookingDate, (filters as any).bookingTime]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters({ ...filters, [key]: value || undefined });
    };

    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
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

                <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Type</InputLabel>
                        <Select
                            value={(filters as any).bookingType || ''}
                            label="Filter by Type"
                            onChange={(e) => {
                                const val = e.target.value;
                                const updatedFilters: any = { ...filters, bookingType: val || undefined };
                                if (val !== 'consultation') updatedFilters.specialistId = undefined;
                                if (val !== 'package') updatedFilters.wellnessPackageId = undefined;
                                if (val !== 'surgery') updatedFilters.surgeryId = undefined;
                                if (val !== 'second-opinion') updatedFilters.secondOpinionId = undefined;
                                setFilters(updatedFilters);
                            }}
                        >
                            <MenuItem value="">All Types</MenuItem>
                            {BOOKING_TYPES.map((type) => (
                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Specialist Filter — enabled only when bookingType = consultation */}
                    <FormControl size="small" sx={{ minWidth: 150 }} disabled={(filters as any).bookingType !== 'consultation'}>
                        <InputLabel>Specialist</InputLabel>
                        <Select
                            value={(filters as any).specialistId || ''}
                            label="Specialist"
                            onChange={(e) => handleFilterChange('specialistId', e.target.value)}
                            renderValue={(selected) => {
                                if (!selected) return 'All';
                                const found = specialists.find(s => s._id === selected);
                                return found ? found.name : selected;
                            }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {specialists.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    {/* Wellness Package Filter — enabled only when bookingType = package */}
                    <FormControl size="small" sx={{ minWidth: 150 }} disabled={(filters as any).bookingType !== 'package'}>
                        <InputLabel>Wellness Package</InputLabel>
                        <Select
                            value={(filters as any).wellnessPackageId || ''}
                            label="Wellness Package"
                            onChange={(e) => handleFilterChange('wellnessPackageId', e.target.value)}
                            renderValue={(selected) => {
                                if (!selected) return 'All';
                                const found = wellnessPackages.find(w => w._id === selected);
                                return found ? found.name : selected;
                            }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {wellnessPackages.map(w => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    {/* Surgery Filter — enabled only when bookingType = surgery */}
                    <FormControl size="small" sx={{ minWidth: 150 }} disabled={(filters as any).bookingType !== 'surgery'}>
                        <InputLabel>Surgery</InputLabel>
                        <Select
                            value={(filters as any).surgeryId || ''}
                            label="Surgery"
                            onChange={(e) => handleFilterChange('surgeryId', e.target.value)}
                            renderValue={(selected) => {
                                if (!selected) return 'All';
                                const found = surgeries.find(s => s._id === selected);
                                return found ? found.full_name : selected;
                            }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {surgeries.map(s => <MenuItem key={s._id} value={s._id}>{s.full_name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    {/* Second Opinion Filter — enabled only when bookingType = second-opinion */}
                    <FormControl size="small" sx={{ minWidth: 150 }} disabled={(filters as any).bookingType !== 'second-opinion'}>
                        <InputLabel>Second Opinion</InputLabel>
                        <Select
                            value={(filters as any).secondOpinionId || ''}
                            label="Second Opinion"
                            onChange={(e) => handleFilterChange('secondOpinionId', e.target.value)}
                            renderValue={(selected) => {
                                if (!selected) return 'All';
                                const found = secondOpinions.find(s => s._id === selected);
                                return found ? found.full_name : selected;
                            }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {secondOpinions.map(s => <MenuItem key={s._id} value={s._id}>{s.full_name}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Date</InputLabel>
                        <Select
                            value={(filters as any).bookingDate || ''}
                            label="Filter by Date"
                            onChange={(e) => handleFilterChange('bookingDate', e.target.value)}
                            renderValue={(selected) => {
                                if (!selected) return 'All Dates';
                                const dateStr = selected as string;
                                const formatted = dateStr.length === 8 ? `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}` : dateStr;
                                return dayjs(formatted).format('DD MMM YYYY');
                            }}
                        >
                            <MenuItem value="">All Dates</MenuItem>
                            {uniqueDates.map((date: string) => {
                                const formatted = date.length === 8 ? `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}` : date;
                                return (
                                    <MenuItem key={date} value={date}>
                                        {dayjs(formatted).format('DD MMM YYYY')}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Time</InputLabel>
                        <Select
                            value={(filters as any).bookingTime || ''}
                            label="Filter by Time"
                            onChange={(e) => handleFilterChange('bookingTime', e.target.value)}
                            renderValue={(selected) => {
                                if (!selected) return 'All Times';
                                return selected as string;
                            }}
                        >
                            <MenuItem value="">All Times</MenuItem>
                            {uniqueTimes.map((t: string) => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Mode</InputLabel>
                        <Select
                            value={(filters as any).serviceMode || ''}
                            label="Filter by Mode"
                            onChange={(e) => handleFilterChange('serviceMode', e.target.value)}
                        >
                            <MenuItem value="">All Modes</MenuItem>
                            {SERVICE_MODES.map((mode) => (
                                <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={(filters as any).status || ''}
                            label="Filter by Status"
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            {BOOKING_STATUSES.map((status) => (
                                <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter by Payment</InputLabel>
                        <Select
                            value={(filters as any).paymentStatus || ''}
                            label="Filter by Payment"
                            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                        >
                            <MenuItem value="">All Payments</MenuItem>
                            {PAYMENT_STATUSES.map((status) => (
                                <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

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

                                {!selectedId && (
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="bookingScope"
                                            control={control}
                                            rules={{ required: 'Booking scope is required' }}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!bookingScope && !!errors.bookingScope}>
                                                    <InputLabel>Booking Scope</InputLabel>
                                                    <Select
                                                        {...field}
                                                        value={bookingScope}
                                                        label="Booking Scope"
                                                        onChange={(e) => {
                                                            const nextScope = e.target.value as 'general' | 'corporate';
                                                            setBookingScope(nextScope);
                                                            field.onChange(nextScope);
                                                            if (nextScope === 'general') {
                                                                setValue('corporateId', undefined);
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value="general">General</MenuItem>
                                                        <MenuItem value="corporate">Corporate</MenuItem>
                                                    </Select>
                                                    {errors.bookingScope && (
                                                        <FormHelperText>{errors.bookingScope?.message as string}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                )}

                                {!selectedId && bookingScope === 'corporate' && (
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name="corporateId"
                                            control={control}
                                            rules={{ required: 'Corporate is required for corporate booking' }}
                                            render={({ field }) => (
                                                <PaginatedSearchDropdown
                                                    label="Corporate"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    fetchOptions={fetchCorporateOptions}
                                                    resetKey={`${bookingScope}`}
                                                    error={!!errors.corporateId}
                                                    helperText={errors.corporateId?.message as string}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}

                                {!canOpenCreateForm && !selectedId && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Select booking scope first to open the booking form.
                                        </Typography>
                                    </Grid>
                                )}

                                {canOpenCreateForm && (
                                    <>
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
                                                rules={{ required: 'User is required' }}
                                                render={({ field }) => (
                                                    <PaginatedSearchDropdown
                                                        label="User"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        fetchOptions={fetchUserOptions}
                                                        resetKey={`${bookingScope}-${watchedCorporateId || ''}`}
                                                        disabled={
                                                            !!selectedId ||
                                                            (!bookingScope && !selectedId) ||
                                                            (bookingScope === 'corporate' && !watchedCorporateId && !selectedId)
                                                        }
                                                        error={!!errors.userId}
                                                        helperText={errors.userId?.message as string}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {bookingType === 'package' && (
                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name="wellnessPackageId"
                                                    control={control}
                                                    rules={{ required: 'Wellness package is required' }}
                                                    render={({ field }) => (
                                                        <PaginatedSearchDropdown
                                                            label="Wellness Package"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            fetchOptions={fetchPackageOptions}
                                                            resetKey={`${bookingScope}-${watchedCorporateId || ''}`}
                                                            disabled={
                                                                !!selectedId ||
                                                                (!bookingScope && !selectedId) ||
                                                                (bookingScope === 'corporate' && !watchedCorporateId && !selectedId)
                                                            }
                                                            error={!!errors.wellnessPackageId}
                                                            helperText={errors.wellnessPackageId?.message as string}
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
                                                        rules={{ required: 'Specialist is required' }}
                                                        render={({ field }) => (
                                                            <PaginatedSearchDropdown
                                                                label="Specialist"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                fetchOptions={fetchSpecialistOptions}
                                                                resetKey={`${bookingScope}-${watchedCorporateId || ''}`}
                                                                disabled={
                                                                    !!selectedId ||
                                                                    (!bookingScope && !selectedId) ||
                                                                    (bookingScope === 'corporate' && !watchedCorporateId && !selectedId)
                                                                }
                                                                error={!!errors.specialistId}
                                                                helperText={errors.specialistId?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Controller
                                                        name="primaryConcern"
                                                        control={control}
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
                                                        render={({ field }) => (
                                                            <FormControl fullWidth size="small" error={!!errors.consultationMode}>
                                                                <InputLabel>Consultation Mode</InputLabel>
                                                                <Select {...field} label="Consultation Mode">
                                                                    {CONSULTATION_MODES.map((mode) => (
                                                                        <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {errors.consultationMode && (
                                                                    <FormHelperText>{errors.consultationMode?.message as string}</FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        {/* Surgery fields */}
                                        {bookingType === 'surgery' && (
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        name="full_name"
                                                        control={control}
                                                        rules={{ required: 'Full name is required' }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Full Name"
                                                                fullWidth
                                                                size="small"
                                                                error={!!errors.full_name}
                                                                helperText={errors.full_name?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        name="email"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Email"
                                                                type="email"
                                                                fullWidth
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        name="speciality"
                                                        control={control}
                                                        rules={{ required: 'Speciality is required' }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Speciality"
                                                                fullWidth
                                                                size="small"
                                                                error={!!errors.speciality}
                                                                helperText={errors.speciality?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Controller
                                                        name="concern"
                                                        control={control}
                                                        rules={{ required: 'Concern is required' }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Concern"
                                                                fullWidth
                                                                multiline
                                                                rows={2}
                                                                size="small"
                                                                error={!!errors.concern}
                                                                helperText={errors.concern?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        {/* Second Opinion fields */}
                                        {bookingType === 'second-opinion' && (
                                            <>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        name="full_name"
                                                        control={control}
                                                        rules={{ required: 'Full name is required' }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Full Name"
                                                                fullWidth
                                                                size="small"
                                                                error={!!errors.full_name}
                                                                helperText={errors.full_name?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Controller
                                                        name="email"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Email"
                                                                type="email"
                                                                fullWidth
                                                                size="small"
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Controller
                                                        name="concern"
                                                        control={control}
                                                        rules={{ required: 'Concern is required' }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                label="Concern"
                                                                fullWidth
                                                                multiline
                                                                rows={2}
                                                                size="small"
                                                                error={!!errors.concern}
                                                                helperText={errors.concern?.message as string}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        {/* Slot Selection - only for package and consultation */}
                                        {!selectedId && (bookingType === 'package' || bookingType === 'consultation') && (
                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name="slotId"
                                                    control={control}
                                                    rules={{ required: 'Slot is required' }}
                                                    render={({ field }) => (
                                                        <PaginatedSearchDropdown
                                                            label="Select Slot"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            fetchOptions={fetchSlotOptions}
                                                            resetKey={`${bookingType}-${watchedSpecialistId || ''}-${watchedWellnessPackageId || ''}`}
                                                            disabled={loadingSlots || !isSlotPrerequisiteSelected || availableSlots.length === 0}
                                                            error={!!errors.slotId}
                                                            helperText={errors.slotId?.message as string}
                                                        />
                                                    )}
                                                />
                                                {!isSlotPrerequisiteSelected && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {bookingType === 'consultation' ? 'Select specialist first.' : 'Select package first.'}
                                                    </Typography>
                                                )}
                                                {!loadingSlots && isSlotPrerequisiteSelected && availableSlots.length === 0 && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        No available slots found. Create a slot first.
                                                    </Typography>
                                                )}
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
                                    </>
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
