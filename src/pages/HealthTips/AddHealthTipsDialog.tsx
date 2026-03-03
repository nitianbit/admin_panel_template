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
} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { uploadFile } from "../../utils/helper";
import { MODULES } from "../../utils/constants";
import { showError } from "../../services/toaster";
import { useHealthTipStore } from "../../services/healthTips";
import { HealthTip } from "../../types/healthTips";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddHealthTipsDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, onUpdate, detail, fetchGrid, filters, setFilters } = useHealthTipStore();

    // Image file refs and existing URL states
    const imageFileRef = React.useRef<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = React.useState<string>("");

    const iconFileRef = React.useRef<File | null>(null);
    const [existingIconUrl, setExistingIconUrl] = React.useState<string>("");

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<HealthTip>({
        defaultValues: {
            title: "",
            description: "",
            shortDescription: "",
            category: "",
            isActive: true,
            order: 0,
        }
    });

    const formData = watch();

    const handleClose = () => {
        toggleModal(false);
        reset();
        imageFileRef.current = null;
        setExistingImageUrl("");
        iconFileRef.current = null;
        setExistingIconUrl("");
    };

    // Filter states
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = (query: string) => {
        const newFilters: any = { ...filters };

        if (query.trim()) {
            const searchTerm = query.trim().toLowerCase();

            // Common categories to check against
            const CATEGORIES = [
                'Nutrition', 'Fitness', 'Mental Health', 'Diet', 'Wellness',
                'Children', 'Senior', 'Women', 'Men', 'Skincare', 'Dental',
                'Cardio', 'Diabetes', 'Weight Loss', 'Immunity', 'Sleep'
            ];

            const matchedCategory = CATEGORIES.find(
                c => c.toLowerCase().includes(searchTerm) || searchTerm.includes(c.toLowerCase())
            );

            if (matchedCategory) {
                // If search term matches a known category, filter by category
                newFilters.category = matchedCategory;
                delete newFilters.title;
            } else {
                // Otherwise, perform a regular title search
                newFilters.title = query.trim();
                delete newFilters.category;
            }
        } else {
            delete newFilters.title;
            delete newFilters.category;
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

    const onSubmit = async (data: HealthTip) => {
        try {
            // Upload main image first if a new file is selected
            let imageUrl = existingImageUrl || "";
            if (imageFileRef.current instanceof File) {
                const uploadRes = await uploadFile({ module: MODULES.HEALTH_TIP }, [imageFileRef.current]);
                if (uploadRes.error) {
                    showError(uploadRes.message || 'Failed to upload image');
                    return;
                }
                const uploadedFiles = uploadRes.data?.data?.files;
                if (uploadedFiles?.length && uploadedFiles[0]?.url) {
                    imageUrl = uploadedFiles[0].url;
                }
            }

            // Upload icon image if a new file is selected
            let iconUrl = existingIconUrl || "";
            if (iconFileRef.current instanceof File) {
                const uploadRes = await uploadFile({ module: MODULES.HEALTH_TIP }, [iconFileRef.current]);
                if (uploadRes.error) {
                    showError(uploadRes.message || 'Failed to upload icon');
                    return;
                }
                const uploadedFiles = uploadRes.data?.data?.files;
                if (uploadedFiles?.length && uploadedFiles[0]?.url) {
                    iconUrl = uploadedFiles[0].url;
                }
            }

            // Build payload - only include imageUrl and icon if they have values
            const payload: any = {
                title: data.title,
                description: data.description || "",
                shortDescription: data.shortDescription || "",
                category: data.category || "",
                isActive: data.isActive ?? true,
                order: data.order ?? 0,
            };

            // Only include imageUrl and icon if they are non-empty
            if (imageUrl) {
                payload.imageUrl = imageUrl;
            }
            if (iconUrl) {
                payload.icon = iconUrl;
            }

            let response: HealthTip | null = null;
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
            console.error("Error submitting health tip:", error);
            showError("An error occurred while saving the health tip");
        }
    };

    const fetchDetail = async (id: string) => {
        try {
            const res = await detail(id);
            if (res.data) {
                reset(res.data);
                if (res.data.imageUrl && typeof res.data.imageUrl === 'string') {
                    setExistingImageUrl(res.data.imageUrl);
                }
                if (res.data.icon && typeof res.data.icon === 'string') {
                    setExistingIconUrl(res.data.icon);
                }
            }
        } catch (error) {
            console.error("Error fetching health tip detail:", error);
            showError("Failed to load health tip details");
        }
    };

    React.useEffect(() => {
        if (isModalOpen) {
            if (selectedId) {
                fetchDetail(selectedId);
            } else {
                reset({
                    title: "",
                    description: "",
                    shortDescription: "",
                    category: "",
                    isActive: true,
                    order: 0,
                });
                imageFileRef.current = null;
                setExistingImageUrl("");
                iconFileRef.current = null;
                setExistingIconUrl("");
            }
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
                    Add Health Tip
                </Button>
            </Stack>
            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullScreen
            >
                <form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <DialogTitle>{selectedId ? "Edit Health Tip" : "Add Health Tip"}</DialogTitle>
                    <DialogContent dividers style={{ flex: 1, overflowY: "auto" }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Title"
                                        fullWidth
                                        {...register("title", { required: "Title is required" })}
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Category"
                                                fullWidth
                                                {...register("category")}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Order"
                                                type="number"
                                                fullWidth
                                                {...register("order", { valueAsNumber: true })}
                                            />
                                        </Grid>
                                    </Grid>

                                    <TextField
                                        label="Short Description"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        {...register("shortDescription")}
                                    />

                                    <Box>
                                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                                            Full Description
                                        </Typography>
                                        <Box sx={{ height: 400, mb: 8 }}>
                                            <Controller
                                                name="description"
                                                control={control}
                                                rules={{ required: "Description is required" }}
                                                render={({ field }) => (
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={field.value || ""}
                                                        onChange={field.onChange}
                                                        style={{ height: "350px" }}
                                                    />
                                                )}
                                            />
                                            {errors.description && (
                                                <Typography color="error" variant="caption">
                                                    {errors.description.message}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Stack spacing={3}>
                                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: 'background.paper' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Status</Typography>
                                        <FormControlLabel
                                            control={
                                                <Controller
                                                    name="isActive"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Switch
                                                            checked={field.value}
                                                            onChange={(e) => field.onChange(e.target.checked)}
                                                        />
                                                    )}
                                                />
                                            }
                                            label={formData.isActive ? "Active" : "Inactive"}
                                        />
                                    </Box>

                                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Main Image</Typography>
                                        {existingImageUrl && (
                                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                                                <CustomImage
                                                    src={existingImageUrl}
                                                    style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 4 }}
                                                />
                                            </Box>
                                        )}
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
                                    </Box>

                                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Icon Image</Typography>
                                        {existingIconUrl && (
                                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                                                <CustomImage
                                                    src={existingIconUrl}
                                                    style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 4 }}
                                                />
                                            </Box>
                                        )}
                                        <ImageUpload
                                            onChange={(files: any) => {
                                                if (files?.length) {
                                                    iconFileRef.current = files[0];
                                                    setExistingIconUrl(URL.createObjectURL(files[0]));
                                                }
                                            }}
                                            allow="image/*"
                                            multiple={false}
                                        />
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleClose} variant="outlined">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {selectedId ? "Update Health Tip" : "Save Health Tip"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddHealthTipsDialog;

