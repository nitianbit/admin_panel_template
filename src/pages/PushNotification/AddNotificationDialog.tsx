import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, Stack, TextField, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import _ from 'lodash';
import moment from "moment";
import React from 'react';
import { useForm } from "react-hook-form";
import DateTimePickerWithInterval from "../../components/DateTimePicker";
import SearchInput from "../../components/SearchInput";
import { useCompanyStore } from "../../services/company";
import { useNotificationStore } from "../../services/notifications";
import { showError } from "../../services/toaster";
import { Notification } from "../../types/notifications";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddNotificationDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate } = useNotificationStore();
    const { globalCompanyId } = useCompanyStore();
    const [data, setData] = React.useState<Notification>({
        company_id: globalCompanyId,
        notification: {
            title: "",
            body: ""
        },
        scheduledTime: moment().unix(),//timestamp
        status: "pending"
    })
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Notification>();

    const resetData = () => setData({
        company_id: "",
        notification: {
            title: "",
            body: ""
        },
        scheduledTime: moment().unix(),//timestamp
        status: ""
    });

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {
        if (!globalCompanyId) {
            showError('Please select a company');
            return
        }

        let response = null;
        const payload: any = _.cloneDeep(data)

        if (data?._id) {
            response = await onUpdate({ ...payload, company_id: globalCompanyId });
        } else {
            response = await onCreate({ ...payload, company_id: globalCompanyId });
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
                    Add Notification
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
                    <DialogTitle>Add Notification</DialogTitle>
                    <DialogContent dividers>

                        <Grid container spacing={3}>
                            {/* Notification Form */}
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardContent>

                                        <TextField
                                            fullWidth
                                            label="Notification Title"
                                            value={data.notification.title}
                                            onChange={(e) => setData(prev => ({ ...prev, notification: { ...prev.notification, title: e.target.value } }))}
                                            margin="dense"
                                            variant="outlined"
                                        />

                                        {/* Message */}
                                        <TextField
                                            fullWidth
                                            label="Notification Message"
                                            value={data.notification.body}
                                            onChange={(e) => setData(prev => ({ ...prev, notification: { ...prev.notification, body: e.target.value } }))}
                                            margin="dense"
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                        />

                                        <Stack
                                            direction="row"
                                            justifyContent="flex-start"
                                            alignItems="center"
                                            spacing={2}
                                            margin="10px"
                                        >
                                            <InputLabel >Schedule Time </InputLabel>
                                            <DateTimePickerWithInterval
                                                value={data.scheduledTime}
                                                onChange={(newTimestamp: number) => console.log('expireAt', newTimestamp)}
                                                placeholder="Select Expiry Time"
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Preview */}
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Preview
                                        </Typography>
                                        <Box
                                            sx={{
                                                border: "1px solid #ccc",
                                                borderRadius: 2,
                                                p: 2,
                                                bgcolor: "#f9f9f9",
                                            }}
                                        >
                                            <Typography variant="subtitle1" gutterBottom>
                                                {data.notification.title || "Notification Title"}
                                            </Typography>
                                            <Typography variant="body1"
                                                sx={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {data.notification.body || "This is the notification message."}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>


                        </Grid>




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

export default AddNotificationDialog