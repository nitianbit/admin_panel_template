import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useCompanyStore } from "../../../services/company";

const CompanyDropDown = () => {
    const { data, globalCompanyId, setGlobalCompanyId } = useCompanyStore();

    const handleChange = (event: any) => {
        setGlobalCompanyId(event.target.value);
    };

    return (
       <>
       {globalCompanyId}
        <FormControl
            variant="outlined"
            size="small"
            sx={{
                minWidth: 200,
                backgroundColor: "transparent",
                borderRadius: "8px",
                color: "white",
                "& .MuiInputLabel-root": {
                    color: "white",
                },
                "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                        borderColor: "white",
                    },
                    "&:hover fieldset": {
                        borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#FAFAFA",
                    },
                },
            }}
        >
            <InputLabel id="company-dropdown-label">Select Company</InputLabel>
            <Select
                labelId="company-dropdown-label"
                id="company-dropdown"
                value={globalCompanyId}
                onChange={handleChange}
                label="Select Company"
                sx={{
                    "& .MuiSelect-select": {
                        padding: "8px",
                        color: "white",
                    },
                }}
            >
                {data.map((company: any) => (
                    <MenuItem
                        key={company._id}
                        value={company._id}
                        sx={{
                            color: "black",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                            },
                        }}
                    >
                        {company.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
       </>
    );
};

export default CompanyDropDown;
