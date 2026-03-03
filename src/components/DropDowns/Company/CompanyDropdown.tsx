import { MenuItem, Select, FormControl, InputLabel, ListItemText, Typography } from "@mui/material";
import { useCompanyStore } from "../../../services/company";
import { useCorporateStore } from "../../../services/corporates";
import { useAppContext } from "../../../services/context/AppContext";
import { useEffect } from "react";

const CompanyDropDown = () => {
    const { globalCompanyId, setGlobalCompanyId } = useCompanyStore();
    const { data: corporateData, fetchGrid } = useCorporateStore();

    const { userData } = useAppContext();

    const handleChange = (event: any) => {
        setGlobalCompanyId(event.target.value);
    };

    useEffect(() => {
        // Fetch corporate data on mount
        fetchGrid();
    }, []);

    useEffect(() => {
        if (userData.role.includes("hr")) {
            setGlobalCompanyId(userData.company);
        }
    }, []);

    // Auto-select first corporate if no globalCompanyId is set and data is available
    useEffect(() => {
        if (!globalCompanyId && corporateData.length > 0) {
            setGlobalCompanyId(corporateData[0]._id ?? "");
        }
    }, [corporateData, globalCompanyId]);

    return (
        <>
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
                <InputLabel id="company-dropdown-label">Select Corporate</InputLabel>
                <Select
                    labelId="company-dropdown-label"
                    id="company-dropdown"
                    value={globalCompanyId}
                    disabled={userData.role.includes("hr")}
                    onChange={handleChange}
                    label="Select Corporate"
                    sx={{
                        "& .MuiSelect-select": {
                            padding: "8px",
                            color: "white",
                        },
                    }}
                    renderValue={(selectedId) => {
                        const selected = corporateData.find((c: any) => c._id === selectedId);
                        if (!selected) return "";
                        return `${selected.name} — ${selected.companyName}`;
                    }}
                >
                    {corporateData.map((corporate: any) => (
                        <MenuItem
                            key={corporate._id}
                            value={corporate._id}
                            sx={{
                                color: "black",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                                },
                            }}
                        >
                            <ListItemText
                                primary={corporate.name}
                                secondary={corporate.companyName}
                                secondaryTypographyProps={{
                                    sx: { fontSize: "0.75rem", color: "text.secondary" },
                                }}
                            />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
};

export default CompanyDropDown;
