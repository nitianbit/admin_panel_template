import { MenuItem, Select } from "@mui/material"
import { useCompanyStore } from "../../../services/company"

const CompanyDropDown = () => {

    const { data, globalCompanyId, setGlobalCompanyId } = useCompanyStore();

    const handleChange = (event: any) => {
        setGlobalCompanyId(event.target.value);
    };

    return (
        <Select onChange={handleChange} value={globalCompanyId}>
            {data.map((company: any) => (
                <MenuItem key={company._id} value={company._id}>
                    {company.name}
                </MenuItem>
            ))}
        </Select>
    )
}

export default CompanyDropDown