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
    handleClose: () => void;
    handleSave: (e: any) => void;
}

const PatiendDialog: React.FC<PatientDialogProps> = ({ open, handleClose, handleSave}) => {

    const { data, totalPages, rows, total, currentPage, filters, isLoading, onPageChange, fetchGrid, onDelete, setFilters, nextPage, prevPage } = usePatientStore();

     const [selectedPatientIds, setSelectedPatientIds] = React.useState([]);


    useEffect(() => {
        if (data?.length == 0) {
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
                total={total}
                loading={isLoading}
                onPageChange={onPageChange}
                module={MODULES.DOCTOR}
                onDelete={(data: any) => {
                    onDelete(data._id)
                }}
                selectedIds={selectedPatientIds}
                setSelectedIds={setSelectedPatientIds}
            />
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => {
                    handleSave(selectedPatientIds)
                }} type="submit" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PatiendDialog