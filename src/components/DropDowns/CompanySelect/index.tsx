import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useCompanyStore } from '../../../services/company';

interface Props {
    register?: any;
    module: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    onChange?: (value: string | unknown) => void
}

const CompanySelect: React.FC<Props> = ({ required = true,disabled=false, module, value, onChange = () => { } }) => {
    const { data } = useCompanyStore();

    return (
        <FormControl fullWidth margin="dense">
            <InputLabel id={`company-${module}-label`}>Company</InputLabel>
            <Select
                labelId={`company-${module}-label`}
                id={`company-${module}`}
                label="Company"
                value={value}
                disabled={disabled}
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

export default CompanySelect