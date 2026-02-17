import AddIcon from "@mui/icons-material/Add";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react';
import { useForm } from "react-hook-form";
import SearchInput from "../../components/SearchInput";

import _ from 'lodash';
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
    const [data, setData] = React.useState<Banner>({ ...initialData });
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Banner>();
    const resetData = () => setData({ ...initialData });

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {

        if (!data?.title) {
            showError('Please enter a title');
            return;
        }

        if (!data?.imageUrl) {
            showError('Please select an image');
            return;
        }

        let response = null;
        const payload: any = _.cloneDeep(data);
        if (typeof data.imageUrl !== 'string') {
            delete payload.imageUrl;
        }
        if (data?._id) {
            response = await onUpdate({ ...payload });
        } else {
            response = await onCreate({ ...payload });
        }

        if (response?._id && data?.imageUrl && typeof data.imageUrl === 'object') {
            const res = await uploadFile({ module: MODULES.BANNER, record_id: response?._id }, [data?.imageUrl]);
            if (res.status >= 200 && res.status < 400) {
                const imagePaths = res.data?.data?.length ? res.data?.data[0] : '';
                await onUpdate({ imageUrl: imagePaths, _id: response?._id });
            }
        }
        resetData();
        handleClose();
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const data = await detail(selectedId);
            reset(data?.data);
            setData(data?.data);
        } catch (error) {

        }
    }

    React.useEffect(() => {
        setData({ ...initialData });
        if (selectedId) {
            fetchDetail(selectedId);
        }
    }, [selectedId]);

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
                    <DialogTitle>{data?._id ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
                    <DialogContent dividers>

                        <TextField
                            margin="dense"
                            id="title"
                            label="Banner Title"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={data.title}
                            onChange={(e) => handleChange("title", e.target.value)}
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
                            value={data.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />

                        <TextField
                            margin="dense"
                            id="linkUrl"
                            label="Link URL"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={data.linkUrl}
                            onChange={(e) => handleChange("linkUrl", e.target.value)}
                        />

                        <FormControl fullWidth margin="dense">
                            <InputLabel id="bannerType-label">Banner Type</InputLabel>
                            <Select
                                labelId="bannerType-label"
                                id="bannerType"
                                value={data.bannerType || 'home'}
                                label="Banner Type"
                                onChange={(e) => handleChange("bannerType", e.target.value)}
                            >
                                {BANNER_TYPES.map((type) => (
                                    <MenuItem key={type.value} value={type.value}>
                                        {type.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="startDate"
                                label="Start Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={data.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                            />

                            <TextField
                                margin="dense"
                                id="endDate"
                                label="End Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={data.endDate}
                                onChange={(e) => handleChange("endDate", e.target.value)}
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
                                value={data.target}
                                onChange={(e) => handleChange("target", e.target.value)}
                            />

                            <TextField
                                margin="dense"
                                id="targetId"
                                label="Target ID"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.targetId}
                                onChange={(e) => handleChange("targetId", e.target.value)}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="order"
                                label="Display Order"
                                type="number"
                                variant="outlined"
                                value={data.order}
                                onChange={(e) => handleChange("order", Number(e.target.value))}
                                sx={{ width: 200 }}
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.isActive ?? true}
                                        onChange={(e) => handleChange("isActive", e.target.checked)}
                                    />
                                }
                                label="Active"
                            />
                        </Stack>

                        {data.imageUrl && typeof data.imageUrl === 'string' ? <CustomImage src={data.imageUrl} style={{ width: '50%', height: 200, objectFit: 'contain', marginTop: 16 }} /> : null}
                        <ImageUpload onChange={(files: any) => handleChange("imageUrl", files?.length ? files[0] : null)} allow="image/*" />

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
