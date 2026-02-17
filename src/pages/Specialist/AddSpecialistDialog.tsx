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
import { Specialist } from "../../types/specialist";
import { MODULES } from "../../utils/constants";
import { uploadFile } from "../../utils/helper";
import { useSpecialistStore } from "../../services/specialist";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialData: Specialist = {
    name: "",
    profilePictureUrl: "",
    rating: 0,
    specialization: "",
    degree: "",
    experienceYears: 0,
    languages: [],
    bio: "",
    consultationFee: 0,
    isConsultationFree: false,
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isActive: true,
    isVerified: false,
};

const AddSpecialistDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate } = useSpecialistStore();
    const [data, setData] = React.useState<Specialist>({ ...initialData });
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Specialist>();
    const resetData = () => setData({ ...initialData });

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {

        if (!data?.name) {
            showError('Please enter a name');
            return;
        }

        if (!data?.specialization) {
            showError('Please enter a specialization');
            return;
        }

        let response = null;
        const payload: any = _.cloneDeep(data);
        if (typeof data.profilePictureUrl !== 'string') {
            delete payload.profilePictureUrl;
        }
        if (data?._id) {
            response = await onUpdate({ ...payload });
        } else {
            response = await onCreate({ ...payload });
        }

        if (response?._id && data?.profilePictureUrl && typeof data.profilePictureUrl === 'object') {
            const res = await uploadFile({ module: MODULES.SPECIALIST, record_id: response?._id }, [data?.profilePictureUrl]);
            if (res.status >= 200 && res.status < 400) {
                const imagePaths = res.data?.data?.length ? res.data?.data[0] : '';
                await onUpdate({ profilePictureUrl: imagePaths, _id: response?._id });
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
                    Add Specialist
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
                    <DialogTitle>{data?._id ? 'Edit Specialist' : 'Add Specialist'}</DialogTitle>
                    <DialogContent dividers>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
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
                                id="specialization"
                                label="Specialization"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.specialization}
                                onChange={(e) => handleChange("specialization", e.target.value)}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="degree"
                                label="Degree"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.degree}
                                onChange={(e) => handleChange("degree", e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                id="experienceYears"
                                label="Experience (Years)"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.experienceYears}
                                onChange={(e) => handleChange("experienceYears", Number(e.target.value))}
                            />
                        </Stack>

                        <TextField
                            margin="dense"
                            id="bio"
                            label="Bio"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={data.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                        />

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="email"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={data.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                id="phone"
                                label="Phone"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="consultationFee"
                                label="Consultation Fee"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.consultationFee}
                                onChange={(e) => handleChange("consultationFee", Number(e.target.value))}
                            />

                            <TextField
                                margin="dense"
                                id="rating"
                                label="Rating"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.rating}
                                onChange={(e) => handleChange("rating", Number(e.target.value))}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="address"
                                label="Address"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                id="city"
                                label="City"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="state"
                                label="State"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.state}
                                onChange={(e) => handleChange("state", e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                id="pincode"
                                label="Pincode"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.pincode}
                                onChange={(e) => handleChange("pincode", e.target.value)}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.isConsultationFree ?? false}
                                        onChange={(e) => handleChange("isConsultationFree", e.target.checked)}
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
                                        checked={data.isVerified ?? false}
                                        onChange={(e) => handleChange("isVerified", e.target.checked)}
                                    />
                                }
                                label="Verified"
                            />
                        </Stack>

                        {data.profilePictureUrl && typeof data.profilePictureUrl === 'string' ? <CustomImage src={data.profilePictureUrl} style={{ width: '50%', height: 200, objectFit: 'contain', marginTop: 16 }} /> : null}
                        <ImageUpload onChange={(files: any) => handleChange("profilePictureUrl", files?.length ? files[0] : null)} allow="image/*" />

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

export default AddSpecialistDialog
