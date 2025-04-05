import AddIcon from "@mui/icons-material/Add";
import {
    Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, InputLabel, Stack, TextField, Typography
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import _ from "lodash";
import { useCompanyStore } from "../../services/company";
import { showError } from "../../services/toaster";
import SearchInput from "../../components/SearchInput";
import { useFormStore } from "../../services/form";

// Slide Transition
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddFormDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, onUpdate, detail } = useFormStore();
    const { globalCompanyId } = useCompanyStore();

    const [data, setData] = React.useState<any>({
        company_id: globalCompanyId,
        title: "",
        description: "",
        status: "draft"
    });

    const { register, handleSubmit, reset, formState: { errors } } = useReactHookForm();

    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const resetData = () =>
        setData({
            company_id: "",
            title: "",
            description: "",
            status: "draft"
        });

    const handleChange = (key: string, value: any) =>
        setData((prev: any) => ({ ...prev, [key]: value }));

    const onSubmit = async () => {
        if (!globalCompanyId) {
            showError("Please select a company");
            return;
        }

        const payload = _.cloneDeep(data);
        let response = null;

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
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <SearchInput />
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Form
                </Button>
            </Stack>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="lg"
                fullWidth
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>Add Form</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardContent>
                                        <TextField
                                            fullWidth
                                            label="Form Title"
                                            value={data.title}
                                            onChange={(e) => handleChange("title", e.target.value)}
                                            margin="dense"
                                            variant="outlined"
                                            required
                                        />

                                        <TextField
                                            fullWidth
                                            label="Form Description"
                                            value={data.description}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                            margin="dense"
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

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
                                                {data.title || "Form Title"}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {data.description || "This is the form description."}
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
    );
};

export default AddFormDialog;
