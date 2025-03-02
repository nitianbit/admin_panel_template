import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react'
import { useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { uploadFile } from "../../utils/helper";
import { MODULES } from "../../utils/constants";
import _ from 'lodash';
import { usePackageStore } from "../../services/packages";
import { Package } from "../../types/packages";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { showError } from "../../services/toaster";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddPackageDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate } = usePackageStore();
    const [data, setData] = React.useState<Package>({
        name: "",
        description: "",
        image: "",
        company: ""
    })
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Package>();

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {
        try {
            if(!data.company){
                return showError("Please select a company")
            }
            let response: Package | null = null;
            const payload: any = _.cloneDeep(data)
            if (typeof data.image !== 'string') {
                delete payload.image
            }
            if (data?._id) {
                response = await onUpdate(payload);
            } else {
                response = await onCreate(payload);
            }
            if (response?._id && data?.image && typeof data.image === 'object') {
                const res = await uploadFile({ module: MODULES.PACKAGES, record_id: response?._id }, [data?.image])
                if (res.status >= 200 && res.status < 400) {
                    const imagePaths = res.data?.data?.length ? res.data?.data[0] : '';
                    await onUpdate({ image: imagePaths, _id: response?._id });
                }
            }
            handleClose();
        } catch (error) {

        }
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
        setData({ name: "", description: "", image: "", company: "" })
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
                    Add Package
                </Button>
            </Stack>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="xs"
                fullWidth
                sx={{ height: "100%" }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>Add Package</DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            margin="dense"
                            id="name"
                            label="Full Name"
                            type="name"
                            fullWidth
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Description"
                            variant="outlined"
                            value={data.description}
                            rows={4}
                            onChange={(e) => handleChange("description", e.target.value)}
                            multiline
                        />

                        <CompanySelect value={data.company} onChange={(value) => {
                            handleChange("company", value)
                        }} module={MODULES.PACKAGES} />

                        {data.image && typeof data.image === 'string' ? <CustomImage src={data.image} style={{ width: '50%', height: 200, objectFit: 'contain' }} /> : null}
                        <ImageUpload onChange={(files: any) => handleChange("image", files?.length ? files[0] : null)} allow="image/*" />

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

export default AddPackageDialog