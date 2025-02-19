import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react'
import { useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, InputLabel, Stack, Switch, TextField } from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import { useOfferStore } from "../../services/offers";
import { Offer } from "../../types/offers";
import ImageUpload from "../../components/ImageUploader";
import { useCompanyStore } from "../../services/company";
import { showError } from "../../services/toaster";
import DateTimePickerWithInterval from "../../components/DateTimePicker";
import moment from "moment";
import { uploadFile } from "../../utils/helper";
import _ from 'lodash'
import CustomImage from "../../components/CustomImage";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddOffersDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate } = useOfferStore();
    const { globalCompanyId } = useCompanyStore();
    const [data, setData] = React.useState<Offer>({
        company: "",
        image: null,
        name: "",
        expireAt: moment(moment().add(1, 'month')).unix(),
        active: true
    })
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Offer>();
    const resetData=()=>setData({company:"",image:null,name:"",expireAt:moment(moment().add(1, 'month')).unix(),active:true});

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {
        if (!globalCompanyId) {
            showError('Please select a company');
            return
        }
        if (!data?.image || !data?.name || !data?.expireAt) {
            showError('Please select all the details');
            return
        }

        let response = null;
        const payload: any = _.cloneDeep(data)
        if (typeof data.image !== 'string') {
            delete payload.image //delete image from payload to be updated as image is already updated one
        }
        if (data?._id) {
            response = await onUpdate({ ...payload, company: globalCompanyId });
        } else {
            response = await onCreate({ ...payload, company: globalCompanyId });
        }

         if (response?._id && data?.image && typeof data.image === 'object') {
            const res = await uploadFile({ module: 'offer', record_id: response?._id }, [data?.image])
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
                    Add Offer
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
                    <DialogTitle>Add Offer</DialogTitle>
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

                        <FormControlLabel
                            style={{ margin: "10px 0px", }}
                            value="start"
                            control={<Switch
                                checked={data.active}
                                onChange={(e) => handleChange("active", e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />}
                            label="Active"
                            labelPlacement="start"
                        />

                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                            margin="10px"
                        >
                            <InputLabel >Expiry </InputLabel>
                            <DateTimePickerWithInterval
                                value={data.expireAt}
                                onChange={(newTimestamp: number) => handleChange('expireAt', newTimestamp)}
                                placeholder="Select Expiry Time"
                            />
                        </Stack>
                       
                       {data.image && typeof data.image==='string' ? <CustomImage src={data.image} style={{ width: '50%',height:200,objectFit:'contain' }}/>:null}
                        <ImageUpload onChange={(files: any) => handleChange("image", files?.length ? files[0] : null)} allow="image/*"/>

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

export default AddOffersDialog