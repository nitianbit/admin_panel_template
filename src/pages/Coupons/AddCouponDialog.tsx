import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, Grid, IconButton, MenuItem, FormControl, InputLabel, Select, Divider, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import { useCouponStore } from "../../services/coupons";
import { useCompanyStore } from "../../services/company";
import { ICoupon, CreateCouponRequest } from "../../types/coupons";
import { DISCOUNT_TYPES, APPLICABLE_TO_TYPES } from "./constants";
import { showError } from "../../services/toaster";
import dayjs from "dayjs";

export default function AddCouponDialog({
    isModalOpen,
    toggleModal,
    selectedId
}: any) {
    const defaultData: Partial<CreateCouponRequest> = {
        code: "",
        title: "",
        description: "",
        discountType: 'percentage',
        discountValue: 0,
        minimumPurchaseAmount: 0,
        maximumDiscountAmount: 0,
        applicableTo: 'all',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
        usageLimitPerUser: 1,
        totalUsageLimit: 100,
        isActive: true,
    }

    const { onCreate, detail, onUpdate, filters, setFilters } = useCouponStore();
    const { globalCompanyId } = useCompanyStore();
    const [couponData, setCouponData] = React.useState<Partial<CreateCouponRequest>>(defaultData)

    const handleChange = (key: keyof CreateCouponRequest, value: any) => {
        setCouponData(prev => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) setFieldErrors(prev => ({ ...prev, [key]: '' }));
    }

    const [fieldErrors, setFieldErrors] = React.useState<{ [key: string]: string }>({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateCouponRequest>();


    const handleClickOpen = () => {
        setCouponData(defaultData);
        toggleModal(true);
    };

    const handleClose = () => {
        toggleModal(false);
        setCouponData(defaultData);
    };

    // Filter states
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = (query: string) => {
        const newFilters: any = { ...filters };

        if (query.trim()) {
            const searchTerm = query.trim().toLowerCase();

            // Check if search matches a discount type
            const matchedDiscount = DISCOUNT_TYPES.find(
                t => t.label.toLowerCase().includes(searchTerm) || t.value.toLowerCase().includes(searchTerm)
            );

            // Check if search matches an applicableTo type
            const matchedApplicable = APPLICABLE_TO_TYPES.find(
                t => t.label.toLowerCase().includes(searchTerm) || t.value.toLowerCase().includes(searchTerm)
            );

            if (matchedDiscount) {
                newFilters.discountType = matchedDiscount.value;
                delete newFilters.applicableTo;
                delete newFilters.code;
            } else if (matchedApplicable) {
                newFilters.applicableTo = matchedApplicable.value;
                delete newFilters.discountType;
                delete newFilters.code;
            } else {
                // Default: search by coupon code
                newFilters.code = query.trim();
                delete newFilters.discountType;
                delete newFilters.applicableTo;
            }
        } else {
            delete newFilters.code;
            delete newFilters.discountType;
            delete newFilters.applicableTo;
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

    const validateForm = (): boolean => {
        const errs: { [key: string]: string } = {};

        if (!couponData.code || couponData.code.trim().length === 0) {
            errs.code = 'Coupon code is required';
        } else if (couponData.code.trim().length < 3) {
            errs.code = 'Coupon code must be at least 3 characters';
        } else if (!/^[A-Z0-9]+$/.test(couponData.code.trim())) {
            errs.code = 'Coupon code must contain only uppercase letters and numbers';
        }

        if (!couponData.title || couponData.title.trim().length === 0) {
            errs.title = 'Title is required';
        }

        if (!couponData.discountValue || Number(couponData.discountValue) <= 0) {
            errs.discountValue = 'Discount value must be greater than 0';
        } else if (couponData.discountType === 'percentage' && Number(couponData.discountValue) > 100) {
            errs.discountValue = 'Percentage discount cannot exceed 100%';
        }

        if (couponData.discountType === 'percentage' && couponData.maximumDiscountAmount !== undefined && Number(couponData.maximumDiscountAmount) < 0) {
            errs.maximumDiscountAmount = 'Max discount amount cannot be negative';
        }

        if (couponData.minimumPurchaseAmount !== undefined && Number(couponData.minimumPurchaseAmount) < 0) {
            errs.minimumPurchaseAmount = 'Min purchase amount cannot be negative';
        }

        if (!couponData.startDate) {
            errs.startDate = 'Start date is required';
        }

        if (!couponData.endDate) {
            errs.endDate = 'End date is required';
        } else if (couponData.startDate && couponData.endDate && couponData.endDate < couponData.startDate) {
            errs.endDate = 'End date must be after start date';
        }

        if (!couponData.usageLimitPerUser || Number(couponData.usageLimitPerUser) < 1) {
            errs.usageLimitPerUser = 'Limit per user must be at least 1';
        }

        if (!couponData.totalUsageLimit || Number(couponData.totalUsageLimit) < 1) {
            errs.totalUsageLimit = 'Total usage limit must be at least 1';
        }

        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onSubmit = () => {
        if (!validateForm()) {
            showError('Please fix the highlighted errors');
            return;
        }

        // Format dates (YYYY-MM-DD to YYYYMMDD)
        const formattedStartDate = couponData.startDate ? couponData.startDate.replace(/-/g, '') : '';
        const formattedEndDate = couponData.endDate ? couponData.endDate.replace(/-/g, '') : '';

        const payload: any = {
            ...couponData,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            // Ensure numerical values are numbers
            discountValue: Number(couponData.discountValue),
            minimumPurchaseAmount: Number(couponData.minimumPurchaseAmount),
            maximumDiscountAmount: Number(couponData.maximumDiscountAmount),
            usageLimitPerUser: Number(couponData.usageLimitPerUser),
            totalUsageLimit: Number(couponData.totalUsageLimit),
            corporateId: globalCompanyId,
        };

        if (selectedId) {
            onUpdate({ _id: selectedId, ...payload } as ICoupon);
        } else {
            onCreate(payload as CreateCouponRequest);
        }
        handleClose();
    };


    const fetchDetail = async (id: string) => {
        try {
            const response = await detail(id);
            const coupon = response;
            if (coupon) {
                // Format dates for input (YYYYMMDD to YYYY-MM-DD)
                const start = coupon.startDate;
                const end = coupon.endDate;

                const formattedStart = start && start.length === 8
                    ? `${start.substring(0, 4)}-${start.substring(4, 6)}-${start.substring(6, 8)}`
                    : start;

                const formattedEnd = end && end.length === 8
                    ? `${end.substring(0, 4)}-${end.substring(4, 6)}-${end.substring(6, 8)}`
                    : end;


                setCouponData({
                    ...coupon as unknown as CreateCouponRequest,
                    startDate: formattedStart,
                    endDate: formattedEnd
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
            setCouponData(defaultData);
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
                    Add Coupon
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
                        <Typography variant="h6">{selectedId ? 'Edit Coupon' : 'Add Coupon'}</Typography>
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
                                    <TextField
                                        margin="dense"
                                        id="code"
                                        label="Coupon Code"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        placeholder="e.g. WELCOME10"
                                        inputProps={{ style: { textTransform: 'uppercase' } }}
                                        value={couponData.code}
                                        onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                                        error={!!fieldErrors.code}
                                        helperText={fieldErrors.code}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="title"
                                        label="Title"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        placeholder="Display Title"
                                        value={couponData.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        error={!!fieldErrors.title}
                                        helperText={fieldErrors.title}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        margin="dense"
                                        id="description"
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size="small"
                                        variant="outlined"
                                        placeholder="Coupon Description"
                                        value={couponData.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                    />
                                </Grid>


                                {/* Discount Details */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Discount Details</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="dense" size="small">
                                        <InputLabel id="discount-type-label">Discount Type</InputLabel>
                                        <Select
                                            labelId="discount-type-label"
                                            id="discountType"
                                            value={couponData.discountType}
                                            label="Discount Type"
                                            onChange={(e) => handleChange("discountType", e.target.value)}
                                        >
                                            {DISCOUNT_TYPES.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="discountValue"
                                        label={couponData.discountType === 'percentage' ? "Discount (%)" : "Discount Amount"}
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={couponData.discountValue}
                                        onChange={(e) => handleChange("discountValue", e.target.value)}
                                        error={!!fieldErrors.discountValue}
                                        helperText={fieldErrors.discountValue}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="maximumDiscountAmount"
                                        label="Max Discount Amount"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={couponData.maximumDiscountAmount}
                                        onChange={(e) => handleChange("maximumDiscountAmount", e.target.value)}
                                        disabled={couponData.discountType === 'fixed'}
                                        error={!!fieldErrors.maximumDiscountAmount}
                                        helperText={fieldErrors.maximumDiscountAmount || 'For percentage discounts only'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="minimumPurchaseAmount"
                                        label="Min Purchase Amount"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={couponData.minimumPurchaseAmount}
                                        onChange={(e) => handleChange("minimumPurchaseAmount", e.target.value)}
                                        error={!!fieldErrors.minimumPurchaseAmount}
                                        helperText={fieldErrors.minimumPurchaseAmount}
                                    />
                                </Grid>

                                {/* Applicability */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Validity & Limits</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="dense" size="small">
                                        <InputLabel id="applicable-to-label">Applicable To</InputLabel>
                                        <Select
                                            labelId="applicable-to-label"
                                            id="applicableTo"
                                            value={couponData.applicableTo}
                                            label="Applicable To"
                                            onChange={(e) => handleChange("applicableTo", e.target.value)}
                                        >
                                            {APPLICABLE_TO_TYPES.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Validity Dates */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="startDate"
                                        label="Start Date"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        value={couponData.startDate}
                                        onChange={(e) => handleChange("startDate", e.target.value)}
                                        error={!!fieldErrors.startDate}
                                        helperText={fieldErrors.startDate}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="endDate"
                                        label="End Date"
                                        type="date"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        value={couponData.endDate}
                                        onChange={(e) => handleChange("endDate", e.target.value)}
                                        error={!!fieldErrors.endDate}
                                        helperText={fieldErrors.endDate}
                                    />
                                </Grid>

                                {/* Usage Limits */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="usageLimitPerUser"
                                        label="Limit Per User"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={couponData.usageLimitPerUser}
                                        onChange={(e) => handleChange("usageLimitPerUser", e.target.value)}
                                        error={!!fieldErrors.usageLimitPerUser}
                                        helperText={fieldErrors.usageLimitPerUser}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="dense"
                                        id="totalUsageLimit"
                                        label="Total Usage Limit"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        value={couponData.totalUsageLimit}
                                        onChange={(e) => handleChange("totalUsageLimit", e.target.value)}
                                        error={!!fieldErrors.totalUsageLimit}
                                        helperText={fieldErrors.totalUsageLimit}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={couponData.isActive || false}
                                                onChange={(e) => handleChange("isActive", e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="Is Active"
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
