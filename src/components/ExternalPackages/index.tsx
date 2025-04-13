import React, { useState, useEffect } from 'react'
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import { ExternalPackage, Package } from '../../types/packages';
import { doGET } from '../../utils/HttpUtils';
import { ENDPOINTS } from '../../services/api/constants';
import { ApiResponse } from '../../types/general';

interface Props {
    register?: any;
    module: string;
    value?: string | string[];
    required?: boolean;
    isMultiple?: boolean;
    onChange?: (value: string | string[]) => void;
    vendor?: string
}

const ExternalPackages: React.FC<Props> = ({
    required = true,
    isMultiple = true,
    module,
    value = isMultiple ? [] : "",
    onChange = () => { },
    vendor = "healthians"
}) => {

    const [data, setData] = useState<ExternalPackage[]>([]);

    useEffect(() => { fetch() }, [vendor])

    const fetch = async () => {
        try {
            if (!vendor) return;
            const response: ApiResponse<ExternalPackage[]> = await doGET(ENDPOINTS.externalPackage(vendor));
            console.log(response)
            if (response.status == 200) {
                setData(response.data?.data)
            }
        } catch (error) {

        }
    }


    const renderSelectedValue = (selected: string | string[]) => {
        if (!selected) return "";

        if (isMultiple) {
            return (selected as string[]).map((id) => {
                const item = data.find((item) => item.deal_id === id);
                return item ? item.name : "";
            }).join(", ");
        } else {
            const item = data.find((item) => item.deal_id === selected);
            return item ? item.name : "";
        }
    };

    return (
        <FormControl fullWidth margin="dense">
            <InputLabel id={`package-${module}-label`}>Package</InputLabel>
            <Select
                labelId={`package-${module}-label`}
                id={`package-${module}`}
                label="Package"
                multiple={isMultiple}
                value={value}
                required={required}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    onChange(isMultiple ? selectedValue : selectedValue as string); // Ensure single select returns a string
                }}
                renderValue={renderSelectedValue}
            >
                {data?.map((item) => (
                    <MenuItem key={item.deal_id} value={item.deal_id}>
                        {isMultiple && <Checkbox checked={Array.isArray(value) && value.includes(item.deal_id ?? "")} />}
                        <ListItemText primary={item.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default ExternalPackages


