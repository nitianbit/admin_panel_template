import AddIcon from "@mui/icons-material/Add";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react';
import { useForm } from "react-hook-form";
import SearchInput from "../../components/SearchInput";

import _ from 'lodash';
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { showError } from "../../services/toaster";
import { WellnessPackage } from "../../types/WellnessPackage";
import { MODULES } from "../../utils/constants";
import { uploadFile } from "../../utils/helper";
import { useWellnessPackageStore } from "../../services/wellnessPackages";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialData: WellnessPackage = {
    name: "",
    description: "",
    bookingProcedure: "",
    imageUrl: "",
    originalPrice: 0,
    discountedPrice: 0,
    totalTestsCount: 0,
    hasFreeDoctorConsultation: false,
    testsIncluded: [],
    category: "",
    isActive: true,
    isPopular: false,
    order: 0,
};

const AddWellnessPackageDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate } = useWellnessPackageStore();
    const [data, setData] = React.useState<WellnessPackage>({ ...initialData });
    const { handleSubmit } = useForm<WellnessPackage>();
    const resetData = () => setData({ ...initialData });

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {

        if (!data?.name) {
            showError('Please enter a name');
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
            const res = await uploadFile({ module: MODULES.WELLNESS_PACKAGE, record_id: response?._id }, [data?.imageUrl]);
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
            // reset(data?.data);
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
                    Add Wellness Package
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
                    <DialogTitle>{data?._id ? 'Edit Wellness Package' : 'Add Wellness Package'}</DialogTitle>
                    <DialogContent dividers>

                        <TextField
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
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
                            id="bookingProcedure"
                            label="Booking Procedure"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={data.bookingProcedure}
                            onChange={(e) => handleChange("bookingProcedure", e.target.value)}
                        />


                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="originalPrice"
                                label="Original Price"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.originalPrice}
                                onChange={(e) => handleChange("originalPrice", Number(e.target.value))}
                            />
                            <TextField
                                margin="dense"
                                id="discountedPrice"
                                label="Discounted Price"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.discountedPrice}
                                onChange={(e) => handleChange("discountedPrice", Number(e.target.value))}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="totalTestsCount"
                                label="Total Tests Count"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.totalTestsCount}
                                onChange={(e) => handleChange("totalTestsCount", Number(e.target.value))}
                            />
                            <TextField
                                margin="dense"
                                id="category"
                                label="Category"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="order"
                                label="Order"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.order}
                                onChange={(e) => handleChange("order", Number(e.target.value))}
                            />
                        </Stack>


                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.hasFreeDoctorConsultation ?? false}
                                        onChange={(e) => handleChange("hasFreeDoctorConsultation", e.target.checked)}
                                    />
                                }
                                label="Free Consultation"
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
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.isPopular ?? false}
                                        onChange={(e) => handleChange("isPopular", e.target.checked)}
                                    />
                                }
                                label="Popular"
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

export default AddWellnessPackageDialog
