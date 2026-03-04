// import React, { useEffect, useState } from 'react';
// import {
//     Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Box, Toolbar
// } from '@mui/material';
// import { ApiResponse } from '../../types/general';
// import { ENDPOINTS } from '../../services/api/constants';
// import { doGET, doPOST, doPUT } from '../../utils/HttpUtils';
// import Appbar from '../../components/Appbar';
// import { Container } from 'reactstrap';
// import CompanySelect from '../../components/DropDowns/CompanySelect';
// import { MODULES } from '../../utils/constants';
// import { Vendor } from '../../types/vendors';
// import { useAppContext } from '../../services/context/AppContext';



// const VendorCompanyPackageAssign = () => {
//     const [vendors, setVendors] = useState<Vendor[]>([]);
//     const [newVendor, setNewVendor] = useState<Vendor>({ name: '', company: [] ,external:true});
//     const [showNewVendorRow, setShowNewVendorRow] = useState(false);
//     const { success, error } = useAppContext()


//     const fetchData = async () => {
//         try {
//             const response: ApiResponse<{ rows: Vendor[] }> = await doGET(`${ENDPOINTS.grid('vendors')}?rows=-1`);
//             if (response.status === 200 && response.data?.data?.rows) {
//                 setVendors(response.data.data.rows);
//             }
//         } catch (error) {
//             console.error('Error fetching vendors:', error);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleVendorChange = (index: number, key: keyof Vendor, value: any) => {
//         const updated = [...vendors];
//         updated[index][key] = value;
//         setVendors(updated);
//     };

//     const handleNewVendorChange = (key: keyof Vendor, value: string) => {
//         setNewVendor(prev => ({ ...prev, [key]: value }));
//     };

//     const handleVendorSave = async (vendor: Vendor) => {
//         try {
//             if (!vendor.name || !vendor.company) return alert('Please fill all fields');

//             const response: ApiResponse<any> = await doPUT(`${ENDPOINTS.update('vendors')}`, vendor);
//             if (response.status === 200) {
//                 success('Vendor saved successfully!');
//                 fetchData();
//             }
//         } catch (err) {
//             console.error('Error saving vendor:', err);
//         }
//     };

//     const handleNewVendorSave = async () => {
//         try {
//             if (!newVendor.name || !newVendor.company) return alert('Please fill all fields');

//             const response: ApiResponse<any> = await doPOST(`${ENDPOINTS.create('vendors')}`, newVendor);
//             if (response.status === 200) {
//                 success('New vendor added!');
//                 setNewVendor({ name: '', company: [],external:true });
//                 setShowNewVendorRow(false);
//                 fetchData();
//             }
//         } catch (err) {
//             console.error('Error saving new vendor:', err);
//         }
//     };

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <Appbar appBarTitle={"Vendor Packages"} />
//             <Box
//                 component="main"
//                 sx={{
//                     backgroundColor: (theme) =>
//                         theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
//                     flexGrow: 1,
//                     overflow: 'auto',
//                     height: "100vh",
//                 }}
//             >
//                 <Toolbar />
//                 <Container>
//                     <Box
//                         sx={{
//                             mt: 4,
//                             mb: 4,
//                             px: 3,
//                             py: 2,
//                         }}
//                     >
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Vendor Name</TableCell>
//                                     <TableCell>Company</TableCell>
//                                     <TableCell>Actions</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {vendors.map((vendor, index) => (
//                                     <TableRow key={vendor._id || index}>
//                                         <TableCell>
//                                             <TextField
//                                                 value={vendor.name}
//                                                 onChange={(e) =>
//                                                     handleVendorChange(index, 'name', e.target.value)
//                                                 }
//                                                 fullWidth
//                                             />
//                                         </TableCell>
//                                         <TableCell>
                                           
//                                             <CompanySelect
//                                                 value={vendor.company}
//                                                 onChange={(value) =>
//                                                     handleVendorChange(index, 'company', value as string[])
//                                                 }
//                                                 module={MODULES.PACKAGES}
//                                                 multiple
//                                             />

//                                         </TableCell>
//                                         <TableCell>
//                                             <Button
//                                                 variant="outlined"
//                                                 color="success"
//                                                 onClick={() => handleVendorSave(vendor)}
//                                             >
//                                                 Save
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}

//                                 {showNewVendorRow && (
//                                     <TableRow>
//                                         <TableCell>
//                                             <TextField
//                                                 value={newVendor.name}
//                                                 onChange={(e) =>
//                                                     handleNewVendorChange('name', e.target.value)
//                                                 }
//                                                 placeholder="New Vendor Name"
//                                                 fullWidth
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             <CompanySelect
//                                                 value={newVendor.company}
//                                                 onChange={(value) =>
//                                                     handleNewVendorChange('company', value as string)
//                                                 }
//                                                 module={MODULES.PACKAGES}
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             <Button
//                                                 variant="contained"
//                                                 color="primary"
//                                                 onClick={handleNewVendorSave}
//                                             >
//                                                 Save
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>

//                         {!showNewVendorRow && (
//                             <Button
//                                 onClick={() => setShowNewVendorRow(true)}
//                                 variant="contained"
//                                 sx={{ mt: 2 }}
//                             >
//                                 Add New Vendor
//                             </Button>
//                         )}
//                     </Box>
//                 </Container>
//             </Box>
//         </Box>
//     );
// };

// export default VendorCompanyPackageAssign;


import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, Checkbox, Box, Toolbar
} from '@mui/material';
import { ApiResponse } from '../../types/general';
import { ENDPOINTS } from '../../services/api/constants';
import { doGET, doPUT } from '../../utils/HttpUtils';
import Appbar from '../../components/Appbar';
import { Container } from 'reactstrap';
import CompanySelect from '../../components/DropDowns/CompanySelect';
import { MODULES } from '../../utils/constants';
import { Vendor } from '../../types/vendors';
import { useAppContext } from '../../services/context/AppContext';
import { useCompanyStore } from '../../services/company';

const VendorCompanyPackageAssign = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const { success, error } = useAppContext();
    const { globalCompanyId } = useCompanyStore();


    const fetchData = async () => {
        try {
            //fetch all vendors
            const response: ApiResponse<{ rows: Vendor[] }> = await doGET(`${ENDPOINTS.grid('vendors')}?rows=-1`);
            if (response.status === 200 && response.data?.data?.rows) {
                setVendors(response.data.data.rows);
                const vendorList = response.data.data.rows;

                if (globalCompanyId) {
                    const preSelected = vendorList
                        .filter(vendor => vendor.company?.includes(globalCompanyId))
                        .map(vendor => vendor._id || '');
                    setSelectedVendors(preSelected);
                }
    
            }
        } catch (err) {
            console.error('Error fetching vendors:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [globalCompanyId]);

    const handleVendorSelect = (vendorId: string) => {
        setSelectedVendors(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSave = async () => {
        if (selectedVendors.length === 0) return alert("Please select at least one vendor.");

        try {
            const promises = selectedVendors.map(async vendorId => {
                const vendor = vendors.find(v => v._id === vendorId);
                if (!vendor) return;

                const currentCompanies = Array.isArray(vendor.company)
                    ? vendor.company
                    : vendor.company
                        ? [vendor.company]
                        : [];

                const updatedCompanies = Array.from(new Set([...currentCompanies, globalCompanyId]));
                

                return doPUT(`${ENDPOINTS.update('vendors')}`, {
                    ...vendor,
                    company: updatedCompanies,
                });
            });

            await Promise.all(promises);
            success("Company assigned to selected vendors.");
            setSelectedVendors([]);
            fetchData();
        } catch (err) {
            error("Failed to assign company to vendors.");
            console.error(err);
        }
    };

    const assignVendor=async (vendorId:string) => {
 
        try { 
                const vendor = vendors.find(v => v._id === vendorId);
                if (!vendor) return;

                const currentCompanies = Array.isArray(vendor.company)
                    ? vendor.company
                    : vendor.company
                        ? [vendor.company]
                        : [];

                // const updatedCompanies = Array.from(new Set([...currentCompanies, globalCompanyId]));
                let updatedCompanies:string[] | null = [...currentCompanies];

                if (globalCompanyId) {
                    if(!currentCompanies.includes(globalCompanyId)){
                        updatedCompanies = Array.from(new Set([...currentCompanies, globalCompanyId]));
                    }else{
                        updatedCompanies = updatedCompanies.filter(company=>company!=globalCompanyId);
                    }
                  }
            if (!updatedCompanies.length) {
                updatedCompanies = null
            }

                
                const response=await doPUT(`${ENDPOINTS.update('vendors')}`, {
                    ...vendor,
                    company: updatedCompanies,
                }); 
           
            success("Company assigned to selected vendors.");
            setSelectedVendors([]);
            fetchData();
        } catch (err) {
            error("Failed to assign company to vendors.");
            console.error(err);
        }
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <Appbar appBarTitle={"Assign Company to Vendors"} />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    overflow: 'auto',
                    height: "100vh",
                }}
            >
                <Toolbar />
                <Container>
                    <Box sx={{ mt: 4, mb: 4, px: 3, py: 2 }}>

                        <Table sx={{ mt: 2 }}>
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell>Select</TableCell> */}
                                    <TableCell>Vendor Name</TableCell>
                                    <TableCell>Action</TableCell>
                                 </TableRow>
                            </TableHead>
                            <TableBody>
                                {vendors.map((vendor) => (
                                    <TableRow key={vendor._id}>
                                        {/* <TableCell>
                                            <Checkbox
                                                checked={selectedVendors.includes(vendor._id || '')}
                                                onChange={() => handleVendorSelect(vendor._id || '')}
                                            />
                                        </TableCell> */}
                                        <TableCell>{vendor.name}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={()=>assignVendor(vendor?._id!)}
                                                variant="contained"
                                                sx={{ mt: 2 }}
                                             >
                                                {selectedVendors.includes(vendor._id || '')?'Remove Company from Vendor':'Assign Company to Vendor'}
                                            </Button>
                                        </TableCell>
                                     </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* <Button
                            onClick={handleSave}
                            variant="contained"
                            sx={{ mt: 2 }}
                            disabled={selectedVendors.length === 0}
                        >
                            Assign Company to Selected Vendors
                        </Button> */}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default VendorCompanyPackageAssign;
