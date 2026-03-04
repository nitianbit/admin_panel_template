import React, { useState, useEffect } from 'react'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { ExternalPackage, Package } from '../../types/packages';
import { doGET } from '../../utils/HttpUtils';
import { ENDPOINTS } from '../../services/api/constants';
import { ApiResponse } from '../../types/general';
import { ExternalSlot } from '../../types/appointment';


interface Props {
    register?: any;
    module: string;
    required?: boolean;
    onChange?: (value: ExternalSlot | null) => void;
    vendor?: string;
    date: string;
    value?: string;
    start?: string;
    end?: string;
}

const ExternalSlotsSelection: React.FC<Props> = ({
    required = true,
    module,
    onChange = () => { },
    vendor = "healthians",
    date,
    value,
    start,
    end
}) => {

    const [data, setData] = useState<ExternalSlot[]>([]);

    useEffect(() => { fetch() }, [vendor, date])

    const fetch = async () => {
        try {
            if (!date || !vendor) return;
            const response: ApiResponse<ExternalSlot[]> = await doGET(ENDPOINTS.externalSlots(vendor, date));
            console.log(response)
            if (response.status == 200) {
                setData(response.data?.data)
            }
        } catch (error) {

        }
    }


    const renderSelectedValue = (stm_id: string) => {
        if (!stm_id) return "";
        // const [slot_time = null, end_time = null, stm_id = null] = (selected || "").split("_");
        const item = data.find((item) => item.stm_id === stm_id);
        return item ? `${item?.slot_time} - ${item.end_time}` : "";
    };



    return (
        <FormControl fullWidth margin="dense">
            <InputLabel id={`slot-${module}-label`}>Slot</InputLabel>
            <Select
                labelId={`slot-${module}-label`}
                id={`slot-${module}`}
                label="Slot"
                value={value}
                required={required}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    onChange(data.find((item) => item.stm_id === selectedValue)??null); // Ensure single select returns a string
                }}
                renderValue={renderSelectedValue}
            >
                {data?.map((item) => {
                    const key=`${item?.slot_time}_${item?.end_time}_${item?.stm_id}`
                    return (
                        <MenuItem key={item?.stm_id} value={item?.stm_id} >
                            <ListItemText primary={`${item?.slot_time} - ${item.end_time}`} />
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default ExternalSlotsSelection


