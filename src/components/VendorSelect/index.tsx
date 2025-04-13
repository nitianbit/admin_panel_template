import { FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';

interface Props {
    value?: string;
    onChange: (value: string | string[]) => void;

}

const VendorSelect: React.FC<Props> = ({
    value,
    onChange
}) => {


    const [data, setData] = useState([
        { _id: 1, name: 'Healthians', value: 'healthians' }
    ]);




    const renderSelectedValue = (selected: string | string[]) => {
        if (!selected) return "";
        const item = data.find((item) => item.value === selected);
        return item ? item.name : "";

    };

    return (
        <FormControl fullWidth margin="dense">
            <InputLabel id={`package-${module}-label`}>Vendor</InputLabel>
            <Select
                labelId={`package-${module}-label`}
                id={`package-${module}`}
                label="Vendor"
                multiple={false}
                value={value}
                required={true}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    onChange(selectedValue as string);
                }}
                renderValue={renderSelectedValue}
            >
                {data?.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        <ListItemText primary={item.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default VendorSelect