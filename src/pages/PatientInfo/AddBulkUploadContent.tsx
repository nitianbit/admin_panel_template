import { Box, Button, Dialog, TextField } from "@mui/material"
import { Patient } from "../../types/patient";
import { useState } from "react";
import { usePatientStore } from "../../services/patient";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";


interface AddBulkPatientDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const AddBulkUpload: React.FC<AddBulkPatientDialogProps> = ({ open, setOpen, }) => {
    const [company, setCompany] = useState<string>("");
    const { fetchGrid, onBulkCreate } = usePatientStore();

    const [file, setFile] = useState<any>(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFile(file);
    };

    const handleCreate = () => {
        if (!file) {
            // Handle error
            return;
        }
        if(!company){
            // Handle error
            return
        }

        // Send the file to the create function
        onBulkCreate({ file,company });

        // Close the dialog and fetch the updated grid data
        handleClose();
        fetchGrid();
    };


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            sx={{ height: "100%" }}
        >
            <Box sx={{ padding: "24px" }}>
                <CompanySelect module={MODULES.PATIENTS} value={company} onChange={(value)=> setCompany(value as string)} />
                <TextField type="file" onChange={handleFileChange} />
                <Button variant="contained" onClick={handleCreate}>Create</Button>
            </Box>
        </Dialog>
    )
}
export default AddBulkUpload