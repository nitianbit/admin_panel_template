import React from 'react'
import { Appointment } from '../../types/appointment';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { APPOINTMENT_STATUS, MODULES, PAYMENT_STATUS } from '../../utils/constants';
import CompanySelect from '../../components/DropDowns/CompanySelect';
import DepartmentSelect from '../../components/DropDowns/DepartmentSelect/DepartmentSelect';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

interface Props {
    handleChange: (key: any, value: any) => void;
    appointMentData: Appointment;
    module: string
}

const AppointmentCommonFields: React.FC<Props> = ({
    handleChange,
    appointMentData,
    module
}) => {


    return (
        <>

            <TextField
                margin="dense"
                id="fee"
                label="Fee"
                type="fee"
                fullWidth
                variant="outlined"
                value={appointMentData?.fee}
                onChange={(e) => handleChange("fee", e.target.value)}

            />

            <FormControl fullWidth margin="dense">
                <InputLabel id="status">Status</InputLabel>
                <Select
                    labelId="status"
                    id="status"
                    label="Status"
                    value={appointMentData?.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                >
                    {
                        Object.keys(APPOINTMENT_STATUS).map((key) => (
                            <MenuItem key={key} value={APPOINTMENT_STATUS[key as keyof typeof APPOINTMENT_STATUS]}>{key}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
                <InputLabel id="paymentStatus">Payment Status</InputLabel>
                <Select
                    labelId="paymentStatus"
                    id="paymentStatus"
                    label="Payment Status"
                    value={appointMentData?.paymentStatus}
                    onChange={(e) => handleChange("paymentStatus", e.target.value)}
                >
                    {
                        Object.keys(PAYMENT_STATUS).map((key) => (
                            <MenuItem key={key} value={PAYMENT_STATUS[key as keyof typeof PAYMENT_STATUS]}>{key}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <CompanySelect
                register={() => { }}
                value={appointMentData?.company}
                onChange={(value) => handleChange("company", value)}
                module={MODULES.APPOINTMENT}
            />

            {/* <DepartmentSelect
                isMultiple={false}
                value={appointMentData.department}
                onChange={(value) => {
                    handleChange("department", value)
                }}
                module={MODULES.APPOINTMENT}
            /> */}

            <LocalizationProvider dateAdapter={AdapterDayjs}>

                <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                        value={appointMentData?.appointmentDate}
                        onChange={(e: any) => {
                            handleChange("appointmentDate", e)
                            console.log(e)
                        }
                        }
                        label="Appointment Date"
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                margin: "dense",
                            },
                        }}
                    />
                </DemoContainer>
            </LocalizationProvider>


        </>
    )
}

export default AppointmentCommonFields