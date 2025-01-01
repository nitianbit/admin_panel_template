import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material"
import { Patient } from "../../types/patient";
import { useForm } from "react-hook-form";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";
import { usePatientStore } from "../../services/patient";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface AddPatientDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedId?: string
}

const AddSinglePatientContent: React.FC<AddPatientDialogProps> = ({ open, setOpen, selectedId }) => {
    const { detail, onUpdate, fetchGrid, onCreate: create } = usePatientStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<Patient>();

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (data: Patient) => {
        if (data?._id) {
            onUpdate(data);
        } else {
            create(data)
        }
        handleClose();
        reset()
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const data = await detail(selectedId);
            reset(data?.data)
        } catch (error) {

        }
    }

    React.useEffect(() => {
        if (selectedId) {
            fetchDetail(selectedId)
        }
    }, [selectedId]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="xs"
            fullWidth
            sx={{ height: "100%" }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Add Patient</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        margin="dense"
                        id="fullName"
                        label="Full Name"
                        type="fullName"
                        fullWidth
                        variant="outlined"
                        {...register("name", {
                            required: "Name is required"
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="gender">Gender</InputLabel>
                        <Select
                            labelId="gender"
                            id="gender"
                            label="Gender"
                            {...register("gender")}
                        >
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                    </FormControl>

                    <CompanySelect register={register} module={MODULES.PATIENTS} />

                    <TextField
                        margin="dense"
                        id="phone"
                        label="Phone no"
                        type="phone"
                        fullWidth
                        variant="outlined"
                        placeholder="0 123456789"
                        {...register("phone", {
                            required: "Phone no is required"
                        })}
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="Address"
                        type="address"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: street name, number, postal code"
                        {...register("address", {
                            required: "Address is required"
                        })}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                    />
                    <TextField
                        margin="dense"
                        id="age"
                        label="Age"
                        type="age"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: 18"
                        {...register("age", {
                            required: "Age is required"
                        })}
                        error={!!errors.age}
                        helperText={errors.age?.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
export default AddSinglePatientContent
