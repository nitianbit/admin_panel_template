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
    const { onCreate, detail, onUpdate } = useBannerStore();
    const { register, handleSubmit, reset, watch, setValue, control } = useForm<Banner>({
        defaultValues: { ...initialData },
    });

    const imageFileRef = React.useRef<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = React.useState<string>("");

    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async (formValues: Banner) => {
        if (!formValues?.title) {
            showError('Please enter a title');
            return;
        }

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
                <SearchInput />
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
                            {...register("title")}
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
                            {...register("description")}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            margin="dense"
                            id="linkUrl"
                            label="Link URL"
                            type="text"
                            fullWidth
                            variant="outlined"
                            {...register("linkUrl")}
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
                                {...register("startDate")}
                            />

                            <TextField
                                margin="dense"
                                id="endDate"
                                label="End Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                {...register("endDate")}
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
                                {...register("order", { valueAsNumber: true })}
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
