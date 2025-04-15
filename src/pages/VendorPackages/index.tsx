import { Box, Toolbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import Appbar from '../../components/Appbar';
import VendorSelect from '../../components/VendorSelect';
import { ENDPOINTS } from '../../services/api/constants';
import { ApiResponse } from '../../types/general';
import { ExternalPackage } from '../../types/packages';
import { Vendor } from '../../types/vendors';
import { doGET } from '../../utils/HttpUtils';

const VendorPackages = () => {
    const [data, setData] = useState<
        {
            packages: ExternalPackage[],
            selectedVendor: string,
            vendors: Vendor[]
        }
    >({
        selectedVendor: 'healthians',
        packages: [],
        vendors: []
    })

    useEffect(() => { fetchData() }, [])

    const fetchData = async () => {
        try {
            const response: ApiResponse<{
                rows: Vendor[]
            }> = await doGET(`${ENDPOINTS.grid('vendors')}?rows=-1`)
            if (response.status == 200) {
                if (response.data?.data?.rows) {
                    handleChange('vendors', response.data?.data?.rows)
                    handleChange('selectedVendor', response.data?.data?.rows[0]?.name)
                    fetchPackages(response.data?.data?.rows[0]?.name)
                }
            }
        } catch (error) {

        }
    }

    const fetchPackages = async (vendor:string | undefined | null) => {
        try {
            if (!vendor) return;
            const response: ApiResponse<ExternalPackage[]> = await doGET(ENDPOINTS.externalPackage(vendor));
            if (response.status == 200) {
                handleChange('packages',response.data?.data);
            }
        } catch (error) {

        }
    }

    const handleChange = (key: string, value: string | string[] | Vendor[]) => setData(prev => ({ ...prev, [key]: value }))

    return (
        <Box sx={{ display: 'flex', }}>
            <Appbar appBarTitle={"Vendor Packages"} />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    overflow: 'auto',
                    height: "100vh",
                }}
            >
                <Toolbar />
                <Container sx={{ mt: 4, mb: 4 }}>
                    <VendorSelect
                        value={data?.selectedVendor}
                        onChange={(value) => {
                            handleChange("vendor", value)
                            fetchPackages(value);
                        }}
                    />

                    {data?.selectedVendor ? <>
                        {/* <ExternalPackages
                            value={data.packages?.map((value) => value?.deal_id)}
                            module={MODULES.PACKAGES}
                            onChange={(value) => {
                                handleChange("packages", value)
                            }}
                            isMultiple={true}
                        /> */}
                        {
                            data?.packages?.map((item: ExternalPackage, index: number) => {
                                return <p key={index}>{item.name}</p>;
                            })
                        }

                    </> : null}

                </Container>
            </Box>
        </Box>
    )
}

export default VendorPackages

