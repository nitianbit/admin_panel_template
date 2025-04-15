import React, { useEffect, useState } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Box, Toolbar
} from '@mui/material';
import { ApiResponse } from '../../types/general';
import { ENDPOINTS } from '../../services/api/constants';
import { doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import Appbar from '../../components/Appbar';
import { Container } from 'reactstrap';
import CompanySelect from '../../components/DropDowns/CompanySelect';
import { MODULES } from '../../utils/constants';
import { Vendor } from '../../types/vendors';
import { useAppContext } from '../../services/context/AppContext';



const VendorCompanyPackageAssign = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [newVendor, setNewVendor] = useState<Vendor>({ name: '', company: '' });
    const [showNewVendorRow, setShowNewVendorRow] = useState(false);
    const { success, error } = useAppContext()


    const fetchData = async () => {
        try {
            const response: ApiResponse<{ rows: Vendor[] }> = await doGET(`${ENDPOINTS.grid('vendors')}?rows=-1`);
            if (response.status === 200 && response.data?.data?.rows) {
                setVendors(response.data.data.rows);
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVendorChange = (index: number, key: keyof Vendor, value: string) => {
        const updated = [...vendors];
        updated[index][key] = value;
        setVendors(updated);
    };

    const handleNewVendorChange = (key: keyof Vendor, value: string) => {
        setNewVendor(prev => ({ ...prev, [key]: value }));
    };

    const handleVendorSave = async (vendor: Vendor) => {
        try {
            if (!vendor.name || !vendor.company) return alert('Please fill all fields');

            const response: ApiResponse<any> = await doPUT(`${ENDPOINTS.update('vendors')}`, vendor);
            if (response.status === 200) {
                success('Vendor saved successfully!');
                fetchData();
            }
        } catch (err) {
            console.error('Error saving vendor:', err);
        }
    };

    const handleNewVendorSave = async () => {
        try {
            if (!newVendor.name || !newVendor.company) return alert('Please fill all fields');

            const response: ApiResponse<any> = await doPOST(`${ENDPOINTS.create('vendors')}`, newVendor);
            if (response.status === 200) {
                success('New vendor added!');
                setNewVendor({ name: '', company: '' });
                setShowNewVendorRow(false);
                fetchData();
            }
        } catch (err) {
            console.error('Error saving new vendor:', err);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Appbar appBarTitle={"Vendor Packages"} />
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
                <Container sx={{ mt: 4, mb: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Vendor Name</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendors.map((vendor, index) => (
                                <TableRow key={vendor._id || index}>
                                    <TableCell>
                                        <TextField
                                            value={vendor.name}
                                            onChange={(e) =>
                                                handleVendorChange(index, 'name', e.target.value)
                                            }
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <CompanySelect
                                            value={vendor.company}
                                            onChange={(value) =>
                                                handleVendorChange(index, 'company', value as string)
                                            }
                                            module={MODULES.PACKAGES}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => handleVendorSave(vendor)}
                                        >
                                            Save
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {showNewVendorRow && (
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            value={newVendor.name}
                                            onChange={(e) =>
                                                handleNewVendorChange('name', e.target.value)
                                            }
                                            placeholder="New Vendor Name"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <CompanySelect
                                            value={newVendor.company}
                                            onChange={(value) =>
                                                handleNewVendorChange('company', value as string)
                                            }
                                            module={MODULES.PACKAGES}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNewVendorSave}
                                        >
                                            Save
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {!showNewVendorRow && (
                        <Button
                            onClick={() => setShowNewVendorRow(true)}
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Add New Vendor
                        </Button>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default VendorCompanyPackageAssign;
