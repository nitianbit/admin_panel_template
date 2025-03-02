// import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
// import React, { useEffect } from 'react'
// import { useDepartmentStore } from '../../../services/departments';

// interface Props {
//     register?: any;
//     module: string;
//     value?: string | string[];
//     required?: boolean;
//     isMultiple?: boolean;
//     onChange?: (value: string | unknown) => void
// }

// const DepartmentSelect: React.FC<Props> = ({ required = true, isMultiple = true, module, value, onChange = () => { } }) => {
//     const { data, fetchGrid } = useDepartmentStore();

//     const renderSelectedValue = (selected: any) => {
//         if (!Array.isArray(selected)) {
//             return '';
//         }
//         return selected.map((id) => {
//             const item = data?.find((item: any) => item._id === id);
//             return item ? item.name : '';
//         }).join(', ');
//     };

//     useEffect(()=>{
//         if(data.length === 0){
//             fetchGrid()
//         }
//     },[])



//     return (
//         <FormControl fullWidth margin="dense">
//             <InputLabel id={`department-${module}-label`}>Department</InputLabel>
//             <Select
//                 labelId={`department-${module}-label`}
//                 id={`department-${module}`}
//                 label="department"
//                 multiple={isMultiple}
//                 value={value}
//                 required={required}
//                 onChange={(e) => onChange(e.target.value)}
//                 renderValue={renderSelectedValue}
//             >
//                  {
//                     data?.map((item: any) => (
//                         <MenuItem key={item._id} value={item._id}>
//                             <Checkbox checked={Array.isArray(value) && value.includes(item._id)} />
//                             <ListItemText primary={item.name} />
//                         </MenuItem>
//                     ))
//                 }
//             </Select>
//         </FormControl>
//     )
// }

// export default DepartmentSelect


import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import React, { useEffect } from 'react';
import { usePackageStore } from '../../../services/packages';
import { useCompanyStore } from '../../../services/company';

interface Props {
    register?: any;
    module: string;
    value?: string | string[];
    required?: boolean;
    isMultiple?: boolean;
    onChange?: (value: string | string[]) => void;
}

const PackagetSelect: React.FC<Props> = ({
    required = true,
    isMultiple = true,
    module,
    value = isMultiple ? [] : "", // Default value based on mode
    onChange = () => { }
}) => {
    const { data, fetchGrid, setFilters } = usePackageStore();

    // useEffect(() => {
    //     if (data.length === 0) {
    //         fetchGrid();
    //     }
    // }, []);
    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (globalCompanyId) {
            setFilters({ company: globalCompanyId })
        } else {
            fetchGrid()
        }
    }, [globalCompanyId])

    // **Handles rendering selected value for both single & multiple select**
    const renderSelectedValue = (selected: string | string[]) => {
        if (!selected) return "";

        if (isMultiple) {
            return (selected as string[]).map((id) => {
                const item = data.find((item) => item._id === id);
                return item ? item.name : "";
            }).join(", ");
        } else {
            const item = data.find((item) => item._id === selected);
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
                    <MenuItem key={item._id} value={item._id}>
                        {isMultiple && <Checkbox checked={Array.isArray(value) && value.includes(item._id ?? "")} />}
                        <ListItemText primary={item.name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default PackagetSelect;
