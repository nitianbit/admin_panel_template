import AddIcon from "@mui/icons-material/Add";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react';
import { useForm } from "react-hook-form";
import SearchInput from "../../components/SearchInput";

import _ from 'lodash';
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { useCompanyStore } from "../../services/company";
import { useServiceImageStore } from "../../services/serviceImages";
import { showError } from "../../services/toaster";
import { ServiceImage } from "../../types/serviceImages";
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

const AddServiceImageDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate } = useServiceImageStore();
    const [data, setData] = React.useState<ServiceImage>({
        image: null,
        name: ""
    })
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceImage>();
    const resetData = () => setData({ image: null });

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {

        if (!data?.image) {
            showError('Please select all the details');
            return
        }

        let response = null;
        const payload: any = _.cloneDeep(data)
        if (typeof data.image !== 'string') {
            delete payload.image
        }
        if (data?._id) {
            response = await onUpdate({ ...payload });
        } else {
            response = await onCreate({ ...payload, });
        }

        if (response?._id && data?.image && typeof data.image === 'object') {
            const res = await uploadFile({ module: MODULES.SERVICE_IMAGES, record_id: response?._id }, [data?.image])
            if (res.status >= 200 && res.status < 400) {
                const imagePaths = res.data?.data?.length ? res.data?.data[0] : '';
                await onUpdate({ image: imagePaths, _id: response?._id });
            }
        }
        resetData();
        handleClose();
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const data = await detail(selectedId);
            reset(data?.data)
            setData(data?.data)
        } catch (error) {

        }
    }

    React.useEffect(() => {
        setData({
            image: null,
            name: ""
        })
        if (selectedId) {
            fetchDetail(selectedId)
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
                    Add Service Image
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
                    <DialogTitle>Add Service Image</DialogTitle>
                    <DialogContent dividers>

                        <TextField
                            margin="dense"
                            id="name"
                            label="Enter Title"
                            type="name"
                            fullWidth
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        {data.image && typeof data.image === 'string' ? <CustomImage src={data.image} style={{ width: '50%', height: 200, objectFit: 'contain' }} /> :null}
                        <ImageUpload onChange={(files: any) => handleChange("image", files?.length ? files[0] : null)} />

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

export default AddServiceImageDialog