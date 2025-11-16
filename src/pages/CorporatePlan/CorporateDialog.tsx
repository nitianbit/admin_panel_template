import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import { useCorporatePlanStore } from "../../services/corporatePlan";
import { CorporatePlanData } from "../../types/corporatePlan";

// Slide Transition
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CorporatePlanDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { detail } = useCorporatePlanStore();

    const [data, setData] = React.useState<CorporatePlanData>({
        full_name: "",
        email: "",
        size: "",
        goals: ""
    });

    const { reset } = useReactHookForm();

    const handleClose = () => toggleModal(false);

    const fetchDetail = async (id: string) => {
        try {
            const response = await detail(id);
            const fetchedData = response?.data;
            reset(fetchedData);
            setData(fetchedData);
        } catch (error) {
            console.error("Failed to fetch corporate plan details", error);
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
            maxWidth="sm"
            fullWidth
        >
            <form>
                <DialogTitle>Corporate Plan Details</DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                value={data.full_name}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                value={data.email}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Company Size"
                                                value={data.size}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Goals"
                                                value={data.goals}
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

export default CorporatePlanDialog;
