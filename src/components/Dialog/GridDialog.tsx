import { Button, Dialog, DialogActions, DialogTitle, Slide } from "@mui/material"
import React, { useEffect } from "react"
import { TransitionProps } from "@mui/material/transitions"
import GeneralTable from '../GridTable/index'
import { COLUMNS } from "../../pages/PatientInfo/constants"
import { MODULES } from "../../utils/constants"
import { GridDialogProps } from "../../types/gridDialog"
import SearchInput from "../SearchInput"
import SearchIcon from '@mui/icons-material/Search';
import { useCompanyStore } from "../../services/company"

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const GridDialog: React.FC<GridDialogProps> = ({
    open,
    handleClose,
    handleSave,
    data,
    totalPages,
    rows = 20,
    total,
    currentPage,
    filters,
    isLoading,
    onPageChange,
    fetchGrid,
    onDelete,
    title = "",
    fullScreen = false,
    hideAction = false,
    showSearch= false
}) => {

    const [selectedPatientIds, setSelectedPatientIds] = React.useState([]);
    const [query, setQuery] = React.useState('')
    const { globalCompanyId } = useCompanyStore();


    useEffect(() => {
        if (data?.length == 0) {
            fetchGrid()
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    //currently it handles only patient make dynamic
    const handleSearch = () => {
        let filters: any = {};
        if (query) {
            filters = {
                name: `caseIgnore[${query}]`
            }
        }

        if (globalCompanyId) {
            filters.company = globalCompanyId
        }
        fetchGrid(filters)
    }


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
            maxWidth="lg"
            fullWidth
            sx={{ height: "100%" }}
            fullScreen={fullScreen}
        >
            <DialogTitle>{title}</DialogTitle>

            {showSearch ? <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                <SearchInput handleChange={handleChange} />
                <Button variant="contained" style={{ borderRadius: 100 }} onClick={handleSearch}>
                    <SearchIcon />
                </Button>
            </div> : null}

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
                hideAction={hideAction}
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

export default GridDialog