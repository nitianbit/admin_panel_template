import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import React, { useEffect } from 'react'
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
    const { data, fetchGrid } = useServicestore();

    const renderSelectedValue = (selected: any) => {
        if (!Array.isArray(selected)) {
            return '';
        }
        return selected.map((id) => {
            const item = data?.find((item: any) => item._id === id);
            return item ? item.name : '';
        }).join(', ');
    };

       useEffect(()=>{
            if(data.length === 0){
                fetchGrid()
            }
        },[])



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
                renderValue={renderSelectedValue}
            >
                {
                    data?.map((item: any) => (
                        <MenuItem key={item._id} value={item._id}>
                            <Checkbox checked={Array.isArray(value) && value.includes(item._id)} />
                            <ListItemText primary={item.name} />
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default ServiceSelect