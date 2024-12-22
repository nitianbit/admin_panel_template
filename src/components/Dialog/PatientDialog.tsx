import { Button, Dialog, DialogActions, DialogTitle, Slide } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useAppContext } from "../../services/context/AppContext"
import { TransitionProps } from "@mui/material/transitions"
import { usePatientStore } from "../../services/patient"
import PatientTable from "../../pages/PatientInfo/PatientTable"

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface PatientDialogProps {
    open: boolean;
    patients: any[];
    handleClose: () => void;
    handleSave: (e:any) => void;
}

const PatiendDialog: React.FC<PatientDialogProps> = ({ patients = [], open, handleClose, handleSave }) => {

    const [selectedIds, setSelectedIds] = useState([]);

    const { data, totalPages, rows, currentPage, filters, isLoading, onPageChange, fetchGrid, create, setFilters, nextPage, prevPage } = usePatientStore();


    useEffect(() => {
        if (data.length == 0) {
            fetchGrid()
        }
    }, [])


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="lg"
            fullWidth
            sx={{ height: "100%" }}
        >
            <DialogTitle>Patients</DialogTitle>

            <PatientTable
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
            />
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={()=>{
                    handleSave(selectedIds)
                }} type="submit" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PatiendDialog