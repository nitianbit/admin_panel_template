import React from 'react';
import ExternalPackages from '../../components/ExternalPackages';
import VendorSelect from '../../components/VendorSelect';
import { Appointment } from '../../types/appointment';
import ExternalSlotsSelection from '../../components/ExternalSlotsSelection';
import dayjs from 'dayjs';
import { timeConverter } from '../../utils/helper';

interface Props {
    handleChange: (key: any, value: any) => void;
    handleChangeTimeSlot:(data: Partial<Appointment>) => void;
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

            {appointMentData?.vendor ? <ExternalPackages
                value={appointMentData.packages}
                module={module}
                onChange={(value) => {
                    handleChange("packages", value)
                }}
                isMultiple={true}
            /> : null}


            {appointMentData?.appointmentDate ?
                <ExternalSlotsSelection
                    date={dayjs(appointMentData.appointmentDate).format("YYYYMMDD")}
                    module={module}
                    onChange={(value) => {
                        if(!value)return;

                        const {slot_time = null, end_time = null, stm_id = null} = value;
                        const data = {
                            ...appointMentData,
                            timeSlot: {
                                start: timeConverter.toHHMM(slot_time!),
                                end: timeConverter.toHHMM(end_time!),
                            },
                            ...(stm_id && {stm_id})
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
                : null}

        </>
    )
}

export default ExternalAppointment