import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useServicestore } from '../../../services/services';

interface Props {
    register?: any;
    module: string;
    value?: string | string[];
    required?: boolean;
    isMultiple?: boolean;
    onChange?: (value: string | unknown) => void
}

const ServiceSelect: React.FC<Props> = ({ required = true, isMultiple = true, module, value, onChange = () => { } }) => {
    const { data } = useServicestore();

    

    return (
        <FormControl fullWidth margin="dense">
            <InputLabel id={`service-${module}-label`}>Service</InputLabel>
            <Select
                labelId={`service-${module}-label`}
                id={`service-${module}`}
                label="service"
                multiple={isMultiple}
                value={value}
                required={required}
                onChange={(e) => onChange(e.target.value)}
            >
                {
                    data?.map((item: any) => {
                        return <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}

export default ServiceSelect