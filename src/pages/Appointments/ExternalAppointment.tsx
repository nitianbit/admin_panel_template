import React from 'react';
import ExternalPackages from '../../components/ExternalPackages';
import VendorSelect from '../../components/VendorSelect';
import { Appointment } from '../../types/appointment';
import ExternalSlotsSelection from '../../components/ExternalSlotsSelection';
import dayjs from 'dayjs';
import { timeConverter } from '../../utils/helper';
import DepartmentSelect from '../../components/DropDowns/DepartmentSelect/DepartmentSelect';
import { MODULES } from '../../utils/constants';
import PackagetSelect from '../../components/DropDowns/PackageSelect/PackageSelect';
import moment from 'moment';
import DatePicker2 from "react-datepicker";
import TimePickerField from '../../components/TimePickerField';

interface Props {
    handleChange: (key: any, value: any) => void;
    handleChangeTimeSlot: (data: Partial<Appointment>) => void;
    appointMentData: Appointment;
    module: string
}

const ExternalAppointment: React.FC<Props> = ({
    handleChange,
    appointMentData,
    module,
    handleChangeTimeSlot
}) => {


    return (
        <>
{appointMentData?.vendor}
            <VendorSelect
                value={appointMentData?.vendor}
                onChange={(value) => {
                    handleChange("vendor", value)
                }}
            />

            {appointMentData?.vendor ? (
                !['EWA','Myewacare'].includes(appointMentData?.vendor)
                    ? <PackagetSelect isMultiple={false} value={appointMentData.package} onChange={(value) => {
                        handleChange("package", value)
                    }} module={MODULES.APPOINTMENT} />
                    :
                    <ExternalPackages
                        value={appointMentData.packages}
                        module={module}
                        onChange={(value) => {
                            handleChange("packages", value)
                        }}
                        isMultiple={true}
                        vendor={appointMentData?.vendor}
                    />
            ) : null}


            {appointMentData?.appointmentDate && appointMentData?.vendor ? (
                !['EWA','Myewacare'].includes(appointMentData?.vendor)
                    ? <ExternalSlotsSelection
                        date={dayjs(appointMentData.appointmentDate).format("YYYYMMDD")}
                        module={module}
                        onChange={(value) => {
                            if (!value) return;

                            const { slot_time = null, end_time = null, stm_id = null } = value;
                            const data = {
                                ...appointMentData,
                                timeSlot: {
                                    start: timeConverter.toHHMM(slot_time!),
                                    end: timeConverter.toHHMM(end_time!),
                                },
                                ...(stm_id && { stm_id })
                            }
                            handleChangeTimeSlot(data);
                            // if(slot_time){
                            //     handleChange('timeSlot.start',timeConverter.toHHMM(slot_time))
                            // }
                            // if(end_time){
                            //     handleChange('timeSlot.end',timeConverter.toHHMM(end_time))
                            // }
                            // if(stm_id){
                            //     handleChange('stm_id',stm_id)
                            // }

                        }}
                        value={appointMentData?.stm_id}
                        start={appointMentData.timeSlot.start}
                        end={appointMentData.timeSlot.end}
                    />
                    : <>
                        <TimePickerField
                            label="Start Time"
                            value={appointMentData?.timeSlot.start}
                            field="timeSlot.start"
                            onChange={handleChange}
                        />

                        <TimePickerField
                            label="End Time"
                            value={appointMentData?.timeSlot.end}
                            field="timeSlot.end"
                            onChange={handleChange}
                        />
                    </>
            )
                : null}

        </>
    )
}

export default ExternalAppointment