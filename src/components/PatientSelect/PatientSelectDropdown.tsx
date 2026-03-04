// import React, { useEffect, useState } from "react";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import { usePatientStore } from "../../services/patient";
// import { Patient } from "../../types/patient";
// import { ENDPOINTS } from "../../services/api/constants";
// import { doGET } from "../../utils/HttpUtils";
// import { showError } from "../../services/toaster";


// interface PatientSelectProps {
//     value: string | null | undefined;
//     onChange: (value: string) => void;
// }

// interface PatientData {
//     data: Patient[];
//     totalPages: number;
//     currentPage: number;
//     filters: any;
//     isLoading: boolean;
//     rows: number;
//     total: number;
// }

// const defaultData = {
//     data: [],
//     totalPages: 0,
//     currentPage: 1,
//     filters: {},
//     isLoading: false,
//     rows: 1,
//     total: 0,
// }

// const PatientSelectDropdown: React.FC<PatientSelectProps> = ({ value, onChange }) => {
//     const [data, setData] = useState<PatientData>(defaultData);

//     const fetch = async () => {
//         try {
//             const { filters, currentPage, rows, isLoading, total } = defaultData;
//             if (isLoading) return;

//             const queryParams = new URLSearchParams(filters);
//             queryParams.append('page', String(currentPage));
//             queryParams.append('rows', String(rows));
//             const apiUrl = `${ENDPOINTS.grid('patients')}?${queryParams.toString()}`;

//             const response = await doGET(apiUrl);

//             if (response.status >= 200 && response.status < 400) {
//                 setData(prev => ({
//                     ...prev,
//                     data: response.data.data.rows,
//                     ...(currentPage == 1 && { totalPages: Math.ceil(response.data.data.total / rows), total: response.data.data.total ?? 0 }),
//                 }));
//             } else {
//                 showError(response.message);
//             }
//         } catch (err) {
//             showError('Failed to fetch doctors');
//         } finally {

//         }
//     }

//     useEffect(() => {
//         fetch();
//     }, [])

//     const handleChange = (event: any) => {
//         onChange(event.target.value);
//     };

//     return (
//         <FormControl size="small" fullWidth sx={{ minWidth: 200 }}>
//             <InputLabel id="select-patient">Select Patient</InputLabel>
//             <Select
//                 labelId="select-patient"
//                 value={value}
//                 onChange={handleChange}
//                 displayEmpty
//             >
//                 <MenuItem value="" disabled>Select a Patient</MenuItem>
//                 {data.data.map((patient: any) => (
//                     <MenuItem key={patient._id} value={patient._id}>
//                         {patient.name} ({patient.email})
//                     </MenuItem>
//                 ))}
//             </Select>
//         </FormControl>
//     );
// };

// export default PatientSelectDropdown;

import React, { useEffect, useState } from "react";
import { 
    FormControl, InputLabel, MenuItem, Select, Box, Button, CircularProgress 
} from "@mui/material";
import { Patient } from "../../types/patient";
import { ENDPOINTS } from "../../services/api/constants";
import { doGET } from "../../utils/HttpUtils";
import { showError } from "../../services/toaster";

interface PatientSelectProps {
    value: string | null | undefined;
    onChange: (value: string) => void;
}

interface PatientData {
    data: Patient[];
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    rows: number;
    total: number;
}

const defaultData: PatientData = {
    data: [],
    totalPages: 0,
    currentPage: 1,
    isLoading: false,
    rows: 5, // Default number of rows per page
    total: 0,
};

const PatientSelect: React.FC<PatientSelectProps> = ({ value, onChange }) => {
    const [data, setData] = useState<PatientData>(defaultData);

    // Fetch patients from API
    const fetchPatients = async (page = 1) => {
        if (data.isLoading) return;

        setData((prev) => ({ ...prev, isLoading: true }));

        try {
            const queryParams = new URLSearchParams();
            queryParams.append("page", String(page));
            queryParams.append("rows", String(data.rows));
            const apiUrl = `${ENDPOINTS.grid("patients")}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                setData({
                    data: response.data.data.rows,
                    totalPages: Math.ceil(response.data.data.total / data.rows),
                    total: response.data.data.total ?? 0,
                    currentPage: page,
                    isLoading: false,
                    rows: data.rows,
                });
            } else {
                showError(response.message);
                setData((prev) => ({ ...prev, isLoading: false }));
            }
        } catch (err) {
            showError("Failed to fetch patients");
            setData((prev) => ({ ...prev, isLoading: false }));
        }
    };

    // Fetch patients on first render
    useEffect(() => {
        fetchPatients(1);
    }, []);

    // Handle patient selection
    const handleChange = (event: any) => {
        onChange(event.target.value);
    };

    // Handle Pagination
    const handleNextPage = () => {
        if (data.currentPage < data.totalPages) {
            fetchPatients(data.currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (data.currentPage > 1) {
            fetchPatients(data.currentPage - 1);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <FormControl size="small" fullWidth sx={{ minWidth: 200 }}>
                <InputLabel id="select-patient">Select Patient</InputLabel>
                <Select
                    labelId="select-patient"
                    value={value}
                    onChange={handleChange}
                    displayEmpty
                    disabled={data.isLoading}
                >
                    <MenuItem value="" disabled>Select a Patient</MenuItem>
                    {data.isLoading ? (
                        <MenuItem disabled>
                            <CircularProgress size={20} />
                        </MenuItem>
                    ) : (
                        data.data.map((patient: any) => (
                            <MenuItem key={patient._id} value={patient._id}>
                                {patient.name} ({patient.email})
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            {/* Pagination Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handlePrevPage} 
                    disabled={data.currentPage === 1 || data.isLoading}
                >
                    Previous
                </Button>
                <span>Page {data.currentPage} of {data.totalPages}</span>
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleNextPage} 
                    disabled={data.currentPage === data.totalPages || data.isLoading}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default PatientSelect;
