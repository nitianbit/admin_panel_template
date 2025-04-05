

import {
    Button, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, TextField
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import { useCompanyStore } from "../../services/company";
import { useFormStore } from "../../services/form";
import { FormData } from "../../types/form";

// Slide Transition
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddFormDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { detail } = useFormStore();
    const { globalCompanyId } = useCompanyStore();

    const [data, setData] = React.useState<FormData>({
        full_name: "",
        age: "",
        gender: "male",
        email: "",
        mobile: "",
        address: "",
        enquire_about: ""
    });

    const { reset } = useReactHookForm();

    const handleClose = () => toggleModal(false);

    const fetchDetail = async (selectedId: string) => {
        try {
            const response = await detail(selectedId);
            const fetchedData = response?.data;
            reset(fetchedData);
            setData(fetchedData);
        } catch (error) {
            console.error("Failed to fetch detail", error);
        }
    };

    React.useEffect(() => {
        if (selectedId) {
            fetchDetail(selectedId);
        }
    }, [selectedId]);

    return (
        <Dialog
            open={isModalOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="md"
            fullWidth
        >
            <form>
                <DialogTitle>View Form</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                value={data.full_name}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Age"
                                                value={data.age}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Gender"
                                                value={data.gender}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                value={data.email}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Mobile"
                                                value={data.mobile}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                value={data.address}
                                                disabled
                                                multiline
                                                rows={2}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Enquire About"
                                                value={data.enquire_about}
                                                disabled
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddFormDialog;
