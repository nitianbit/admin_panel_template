import AddIcon from "@mui/icons-material/Add";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react';
import { Controller, useForm } from "react-hook-form";
import SearchInput from "../../components/SearchInput";

import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { useBannerStore } from "../../services/banners";
import { useCompanyStore } from "../../services/company";
import { showError } from "../../services/toaster";
import { Banner, BannerType } from "../../types/banners";
import { MODULES } from "../../utils/constants";
import { uploadFile } from "../../utils/helper";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BANNER_TYPES: { label: string; value: BannerType }[] = [
    { label: 'Home', value: 'home' },
    { label: 'Promotional', value: 'promotional' },
    { label: 'Category', value: 'category' },
    { label: 'Wellness Package', value: 'wellnessPackage' },
    { label: 'Specialist', value: 'specialist' },
    { label: 'Surgery', value: 'surgery' },
    { label: 'Second Opinion', value: 'second-opinion' },
];

const initialData: Banner = {
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    bannerType: "home",
    startDate: "",
    endDate: "",
    target: "",
    targetId: "",
    isActive: true,
    order: 0,
};

const AddBannerDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate, setFilters, filters } = useBannerStore();
    const { globalCompanyId } = useCompanyStore();
    const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<Banner>({
        defaultValues: { ...initialData },
    });

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

            // Check if user is searching for a Banner Type
            const matchedType = BANNER_TYPES.find(
                t => t.label.toLowerCase().includes(searchTerm) || t.value.toLowerCase().includes(searchTerm)
            );

            if (matchedType) {
                // If the search looks like a banner type, filter by that type
                newFilters.bannerType = matchedType.value;
                delete newFilters.title;
            } else {
                // Otherwise, perform a regular title search
                newFilters.title = query.trim();
                delete newFilters.bannerType;
            }
        } else {
            delete newFilters.title;
            delete newFilters.bannerType;
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

    const onSubmit = async (formValues: Banner) => {
        if (!imageFileRef.current && !existingImageUrl) {
            showError('Please select an image');
            return;
        }

        const formatDate = (date: string) => date ? date.split('-').join('') : '';

        let imageUrl = existingImageUrl || "";
        if (imageFileRef.current instanceof File) {
            const uploadRes = await uploadFile({ module: MODULES.BANNER }, [imageFileRef.current]);
            console.log('Upload response:', JSON.stringify(uploadRes, null, 2));

            if (uploadRes.error) {
                showError(uploadRes.message || 'Failed to upload image');
                return;
            }

            const uploadedFiles = uploadRes.data?.data?.files;
            if (uploadedFiles?.length && uploadedFiles[0]?.url) {
                imageUrl = uploadedFiles[0].url;
            }
        }

        if (!imageUrl) {
            showError('Image upload failed. Please try again.');
            return;
        }

        const payload: any = {
            title: formValues.title,
            description: formValues.description || "",
            linkUrl: formValues.linkUrl || "",
            bannerType: formValues.bannerType || "home",
            startDate: formatDate(formValues.startDate || ""),
            endDate: formatDate(formValues.endDate || ""),
            target: formValues.target || "",
            targetId: formValues.targetId || "",
            isActive: formValues.isActive ?? true,
            order: formValues.order ?? 0,
            imageUrl: imageUrl,
            corporateId: globalCompanyId,
        };

        let response = null;

        if (formValues?._id) {
            payload._id = formValues._id;
            response = await onUpdate(payload);
        } else {
            response = await onCreate(payload);
        }

        reset({ ...initialData });
        imageFileRef.current = null;
        setExistingImageUrl("");
        handleClose();
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const data = await detail(selectedId);
            reset(data?.data);
            if (data?.data?.imageUrl && typeof data.data.imageUrl === 'string') {
                setExistingImageUrl(data.data.imageUrl);
            }
        } catch (error) {

        }
    }

    React.useEffect(() => {
        reset({ ...initialData });
        imageFileRef.current = null;
        setExistingImageUrl("");
        if (selectedId) {
            fetchDetail(selectedId);
        }
    }, [selectedId]);

    const watchedId = watch("_id");
    const watchedIsActive = watch("isActive");

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <SearchInput handleChange={handleSearchChange} />
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                    Add Banner
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
                    <DialogTitle>{watchedId ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
                    <DialogContent dividers>

                        <TextField
                            margin="dense"
                            id="title"
                            label="Banner Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            {...register("title", {
                                required: 'Title is required',
                                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message as string}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            {...register("description", {
                                required: 'Description is required',
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message as string}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            margin="dense"
                            id="linkUrl"
                            label="Link URL"
                            type="text"
                            fullWidth
                            variant="outlined"
                            {...register("linkUrl", {
                                pattern: {
                                    value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                                    message: 'Please enter a valid URL',
                                },
                            })}
                            error={!!errors.linkUrl}
                            helperText={errors.linkUrl?.message as string}
                            InputLabelProps={{ shrink: true }}
                        />

                        <Controller
                            name="bannerType"
                            control={control}
                            defaultValue="home"
                            render={({ field }) => (
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="bannerType-label">Banner Type</InputLabel>
                                    <Select
                                        labelId="bannerType-label"
                                        id="bannerType"
                                        label="Banner Type"
                                        {...field}
                                        value={field.value || 'home'}
                                    >
                                        {BANNER_TYPES.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="startDate"
                                label="Start Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                {...register("startDate", {
                                    required: 'Start date is required',
                                })}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message as string}
                            />

                            <TextField
                                margin="dense"
                                id="endDate"
                                label="End Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                {...register("endDate", {
                                    required: 'End date is required',
                                    validate: (value) => {
                                        const startDate = watch('startDate');
                                        if (startDate && value && value < startDate) {
                                            return 'End date must be after start date';
                                        }
                                        return true;
                                    },
                                })}
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message as string}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="target"
                                label="Target"
                                type="text"
                                fullWidth
                                variant="outlined"
                                {...register("target")}
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                margin="dense"
                                id="targetId"
                                label="Target ID"
                                type="text"
                                fullWidth
                                variant="outlined"
                                {...register("targetId")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="order"
                                label="Display Order"
                                type="number"
                                variant="outlined"
                                {...register("order", {
                                    valueAsNumber: true,
                                    min: { value: 0, message: 'Order must be 0 or greater' },
                                })}
                                error={!!errors.order}
                                helperText={errors.order?.message as string}
                                sx={{ width: 200 }}
                                InputLabelProps={{ shrink: true }}
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
                        </Stack>

                        {existingImageUrl ? <CustomImage src={existingImageUrl} style={{ width: '50%', height: 200, objectFit: 'contain', marginTop: 16 }} /> : null}
                        <ImageUpload
                            onChange={(files: any) => {
                                imageFileRef.current = files?.length ? files[0] : null;
                                if (files?.length) {
                                    setExistingImageUrl("");

                                }
                                console.log(imageFileRef.current);
                            }}
                            allow="image/*"
                        />

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

export default AddBannerDialog
