import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material"
import { Patient } from "../../types/patient";
import { useForm } from "react-hook-form";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";
import { usePatientStore } from "../../services/patient";
import { useAppContext } from "../../services/context/AppContext";
import { useCompanyStore } from "../../services/company";

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
    const {userData} = useAppContext();
    const { detail, onUpdate, fetchGrid, onCreate: create } = usePatientStore();
    const {globalCompanyId} = useCompanyStore();
    const defaultData={
        name: "",
        gender: "",
        company: userData.role.includes("hr") && globalCompanyId ? globalCompanyId : "",
        phone: "",
        address: "",
        age: "",
        email:"",
        isVerified:true,
    }
    const [patientData, setPatientData] = React.useState<Patient>(defaultData);
    const {
        handleSubmit,
        reset,
    } = useForm<Patient>();

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (key: any, value: any) => {

        setPatientData({ ...patientData, [key]: value });
    };


    const onSubmit = () => {
        if (patientData?._id) {
            onUpdate(patientData);
        } else {
            create(patientData)
        }
        handleClose();
        reset()
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const data = await detail(selectedId);
            reset(data?.data)
            setPatientData(data?.data)
        } catch (error) {

        }
    }

    React.useEffect(() => {
        setPatientData(defaultData)
        if (selectedId) {
            fetchDetail(selectedId)
        }
    }, [selectedId]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="sm"
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
                        value={patientData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="gender">Gender</InputLabel>
                        <Select
                            labelId="gender"
                            id="gender"
                            label="Gender"
                            value={patientData.gender}
                            onChange={(e) => handleChange("gender", e.target.value)}
                        >
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                    </FormControl>

                    <CompanySelect disabled={userData.role.includes("hr")} value={patientData.company} onChange={(value) => {
                        handleChange("company", value)
                    }} module={MODULES.PATIENTS} />

                    <TextField
                        margin="dense"
                        id="phone"
                        label="Phone no"
                        type="phone"
                        fullWidth
                        variant="outlined"
                        placeholder="0 123456789"
                        value={patientData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Patient Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Patient Email"
                        value={patientData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="Address"
                        type="address"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: street name, number, postal code"
                        value={patientData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="age"
                        label="Age"
                        type="age"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: 18"
                        value={patientData.age}
                        onChange={(e) => handleChange("age", e.target.value)}
                    />
                     <TextField
                        margin="dense"
                        id="height"
                        label="Height (in cm)"
                        type="height"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: 18"
                        value={String(patientData.height??"")}
                        typeof="number"
                        onChange={(e) => handleChange("height", e.target.value)}
                    />
                     <TextField
                        margin="dense"
                        id="weight"
                        label="Weight (in Kg)"
                        type="weight"
                        fullWidth
                        variant="outlined"
                        placeholder="ex: 18"
                        value={String(patientData.weight??"")}
                        onChange={(e) => handleChange("weight", e.target.value)}
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
