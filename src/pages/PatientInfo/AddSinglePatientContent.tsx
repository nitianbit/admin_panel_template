import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material"
import { Patient } from "../../types/patient";
import { useForm } from "react-hook-form";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";

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
    create: (data: Patient) => void;
    fetchGrid: () => void;
}

const AddSinglePatientContent:React.FC<AddPatientDialogProps> = ({ open, setOpen, create, fetchGrid }) => {
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
        console.log(data);
        create(data)
        fetchGrid()
        handleClose();
        reset()
    };

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