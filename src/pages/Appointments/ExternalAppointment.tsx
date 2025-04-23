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

            <VendorSelect
                value={appointMentData?.vendor}
                onChange={(value) => {
                    handleChange("vendor", value)
                }}
            />

            {appointMentData?.vendor ? (
                appointMentData?.vendor === 'EWA'
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
                appointMentData?.vendor !== 'EWA'
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
                        <div className="time-container">
                            <label>Start Time</label>
                            <DatePicker2
                                selected={appointMentData?.timeSlot.start ? moment(`${moment().format('DDMMYYYY')}${moment(appointMentData?.timeSlot.start, 'HHmm').format('HH:mm')}`, 'DDMMYYYYHHmm').toDate() : undefined}
                                onChange={(date) => {
                                    handleChange("timeSlot.start", moment(date).format('HHmm'))
                                }}
                                showTimeSelectOnly
                                showTimeSelect
                                wrapperClassName={`w-100 react-datepicker-wrapper custom-date-picker-wrapper`}
                                dateFormat="dd-MM-yyyy HH:mm"
                                className="w-100 time-input"
                                timeFormat="HH:mm"
                                value={appointMentData?.timeSlot.start ? moment(appointMentData?.timeSlot.start, 'HHmm').format('hh:mm A') : 'Select Start Time'}
                                timeInputLabel="Start Time"
                                timeIntervals={15}
                            />
                        </div>
                        <div className="time-container">
                            <label>End Time</label>
                            <DatePicker2
                                selected={appointMentData?.timeSlot.end ? moment(`${moment().format('DDMMYYYY')}${moment(appointMentData?.timeSlot.end, 'HHmm').format('HH:mm')}`, 'DDMMYYYYHHmm').toDate() : undefined}
                                onChange={(date) => {
                                    handleChange("timeSlot.end", moment(date).format('HHmm'))
                                }}
                                showTimeSelectOnly
                                showTimeSelect
                                wrapperClassName={`w-100 react-datepicker-wrapper custom-date-picker-wrapper`}
                                dateFormat="dd-MM-yyyy HH:mm"
                                className="w-100 time-input"
                                timeFormat="HH:mm"
                                value={appointMentData?.timeSlot.end ? moment(appointMentData?.timeSlot.end, 'HHmm').format('hh:mm A') : 'Select End Time'}
                                timeInputLabel="End Time"
                                timeIntervals={15}
                            />
                        </div>
                    </>
            )
                : null}

        </>
    )
}

export default ExternalAppointment