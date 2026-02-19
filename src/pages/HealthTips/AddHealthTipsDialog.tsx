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
import _ from "lodash";
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
    const { onCreate, onUpdate, detail, fetchGrid } = useHealthTipStore();

    // We use a separate state for the image file to handle uploads
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [previewImage, setPreviewImage] = React.useState<string>("");

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<HealthTip>({
        defaultValues: {
            title: "",
            description: "",
            shortDescription: "",
            category: "",
            isActive: true,
            order: 0,
            imageUrl: "",
        }
    });

    const formData = watch();

    const handleClose = () => {
        toggleModal(false);
        reset();
        setImageFile(null);
        setPreviewImage("");
    };

    const onSubmit = async (data: HealthTip) => {
        try {
            let response: HealthTip | null = null;

            // Prepare payload - usually we don't send the file directly in the JSON payload if using a separate upload endpoint
            const payload = { ...data };
            if (selectedId) {
                payload._id = selectedId;
            }

            if (selectedId) {
                response = await onUpdate(payload);
            } else {
                response = await onCreate(payload);
            }

            if (response?._id && imageFile) {
                const res = await uploadFile(
                    { module: MODULES.HEALTH_TIP, record_id: response._id },
                    [imageFile]
                );
                if (res.status >= 200 && res.status < 400) {
                    const imagePath = res.data?.data?.length ? res.data.data[0] : "";
                    await onUpdate({ ...response, imageUrl: imagePath });
                }
            }

            handleClose();
            fetchGrid(); // Refresh the list
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
                if (res.data.imageUrl) {
                    setPreviewImage(res.data.imageUrl);
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
                    imageUrl: "",
                });
                setImageFile(null);
                setPreviewImage("");
            }
        }
    }, [selectedId, isModalOpen]);

    const handleClickOpen = () => toggleModal(true);

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <SearchInput handleChange={(e: any) => fetchGrid(1, { search: e.target.value })} />
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
                                    <Box sx={{ p: 2, border: '1px border #ddd', borderRadius: 1, bgcolor: 'background.paper' }}>
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
                                        {previewImage && (
                                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                                                <CustomImage
                                                    src={previewImage}
                                                    style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 4 }}
                                                />
                                            </Box>
                                        )}
                                        <ImageUpload
                                            onChange={(files: any) => {
                                                if (files?.length) {
                                                    setImageFile(files[0]);
                                                    setPreviewImage(URL.createObjectURL(files[0]));
                                                }
                                            }}
                                            allow="image/*"
                                            multiple={false}
                                        />
                                    </Box>

                                    <TextField
                                        label="Icon (optional)"
                                        fullWidth
                                        placeholder="Enter icon name or SVG path"
                                        {...register("icon")}
                                    />
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
