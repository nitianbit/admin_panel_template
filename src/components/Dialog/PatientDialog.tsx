import { Button, Dialog, DialogActions, DialogTitle, Slide } from "@mui/material"
import React, { useEffect, useState } from "react"
import { TransitionProps } from "@mui/material/transitions"
import { usePatientStore } from "../../services/patient"
import GeneralTable from '../GridTable/index'
import { COLUMNS } from "../../pages/PatientInfo/constants"
import { MODULES } from "../../utils/constants"

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
    handleSave: (e: any) => void;
}

const PatiendDialog: React.FC<PatientDialogProps> = ({ patients = [], open, handleClose, handleSave }) => {

    const [selectedIds, setSelectedIds] = useState([]);

    const { data, totalPages, rows, currentPage, filters, isLoading, onPageChange, fetchGrid, onDelete, setFilters, nextPage, prevPage } = usePatientStore();


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
            <GeneralTable
                data={data}
                columns={COLUMNS}
                currentPage={currentPage}
                totalPages={totalPages}
                loading={isLoading}
                onPageChange={onPageChange}
                module={MODULES.DOCTOR}
                onDelete={(data: any) => {
                    onDelete(data._id)
                }}
            />
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => {
                    handleSave(selectedIds)
                }} type="submit" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PatiendDialog