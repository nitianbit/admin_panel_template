import { FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ApiResponse } from '../../types/general';
import { Vendor } from '../../types/vendors';
import { doGET } from '../../utils/HttpUtils';
import { ENDPOINTS } from '../../services/api/constants';
import { useCompanyStore } from '../../services/company';

interface Props {
    value?: string;
    onChange: (value: string) => void;

}

const VendorSelect: React.FC<Props> = ({
    value,
    onChange
}) => {

    const { globalCompanyId } = useCompanyStore();


    const [data, setData] = useState<Vendor[]>([]);

    useEffect(() => { fetchData() }, [globalCompanyId])

    const fetchData = async () => {
        try {
            if (!globalCompanyId) return;
            const response: ApiResponse<{
                rows: Vendor[]
            }> = await doGET(`${ENDPOINTS.grid('vendors')}?rows=-1&company=${globalCompanyId}`)
            if (response.status == 200) {
                if (response.data?.data?.rows) {
                    setData(response.data?.data?.rows)

                }
            }
        } catch (error) {

        }
    }




    const renderSelectedValue = (selected: string | string[]) => {
        if (!selected) return "";
        const item = data.find((item) => item.name === selected);
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
                    <MenuItem key={item.name} value={item.name}>
                        <ListItemText primary={item.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default VendorSelect