import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Stack,
    FormControlLabel,
    Switch,
    Typography,
    Box,
    MenuItem,
    Tabs,
    Tab,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { uploadFile } from "../../utils/helper";
import { MODULES } from "../../utils/constants";
import _ from "lodash";
import { showError } from "../../services/toaster";
import { useUserStore } from "../../services/user";
import { UserData } from "../../types/user";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`user-tabpanel-${index}`}
            aria-labelledby={`user-tab-${index}`}
            {...other}
            style={{ paddingTop: '20px' }}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

const AddUserDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, onUpdate, detail, fetchGrid } = useUserStore();
    const [tabValue, setTabValue] = React.useState(0);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [previewImage, setPreviewImage] = React.useState<string>("");

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<UserData>({
        defaultValues: {
            userType: 'user',
            isActive: true,
            isVerified: false,
            gender: 'Male',
        }
    });

    const formData = watch();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleClose = () => {
        toggleModal(false);
        reset();
        setImageFile(null);
        setPreviewImage("");
        setTabValue(0);
    };

    const onSubmit = async (data: UserData) => {
        try {
            let response: UserData | null = null;
            const payload = { ...data };

            if (selectedId) {
                payload._id = selectedId;
                response = await onUpdate(payload);
            } else {
                response = await onCreate(payload);
            }

            if (response?._id && imageFile) {
                const res = await uploadFile(
                    { module: MODULES.USER, record_id: response._id },
                    [imageFile]
                );
                if (res.status >= 200 && res.status < 400) {
                    const imagePath = res.data?.data?.length ? res.data.data[0] : "";
                    await onUpdate({ ...response, profilePictureUrl: imagePath });
                }
            }

            handleClose();
            fetchGrid();
        } catch (error) {
            console.error("Error submitting user:", error);
            showError("An error occurred while saving the user");
        }
    };

    const fetchDetail = async (id: string) => {
        try {
            const res = await detail(id);
            if (res.data) {
                reset(res.data);
                if (res.data.profilePictureUrl) {
                    setPreviewImage(res.data.profilePictureUrl);
                }
            }
        } catch (error) {
            console.error("Error fetching user detail:", error);
            showError("Failed to load user details");
        }
    };

    React.useEffect(() => {
        if (isModalOpen) {
            if (selectedId) {
                fetchDetail(selectedId);
            } else {
                reset({
                    userType: 'user',
                    isActive: true,
                    isVerified: false,
                    gender: 'Male',
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    country: "India",
                });
                setImageFile(null);
                setPreviewImage("");
            }
        }
    }, [selectedId, isModalOpen]);

    return (
        <Dialog
            open={isModalOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
            fullScreen
        >
            <form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <DialogTitle>
                    <Typography variant="h5" fontWeight="600">
                        {selectedId ? "Edit User Account" : "Create New User Account"}
                    </Typography>
                </DialogTitle>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="user details tabs">
                        <Tab label="Basic Info" />
                        <Tab label="Profile Details" />
                        <Tab label="Address & Location" />
                        <Tab label="Access & Professional" />
                    </Tabs>
                </Box>

                <DialogContent dividers style={{ flex: 1, overflowY: "auto", padding: '24px' }}>
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Stack spacing={2} alignItems="center">
                                    <Box sx={{ width: 200, height: 200, borderRadius: '50%', border: '4px solid #f0f0f0', overflow: 'hidden', position: 'relative', bgcolor: '#fafafa', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {previewImage ? (
                                            <CustomImage src={previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Typography variant="caption" color="textSecondary">No Image</Typography>
                                        )}
                                    </Box>
                                    <ImageUpload
                                        onChange={(files: any) => {
                                            if (files?.length) {
                                                setImageFile(files[0]);
                                                setPreviewImage(URL.createObjectURL(files[0]));
                                            }
                                        }}
                                        allow="image/*"
                                        multiple={false}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Full Name"
                                            fullWidth
                                            {...register("name", { required: "Name is required" })}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Email Address"
                                            fullWidth
                                            {...register("email", { pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Phone Number"
                                            fullWidth
                                            {...register("phone")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            select
                                            label="User Type"
                                            fullWidth
                                            {...register("userType", { required: "User type is required" })}
                                        >
                                            <MenuItem value="user">Standard User</MenuItem>
                                            <MenuItem value="admin">Administrator</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={4} sx={{ mt: 1 }}>
                                            <FormControlLabel
                                                control={<Controller name="isActive" control={control} render={({ field }) => (
                                                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                                )} />}
                                                label="Active Account"
                                            />
                                            <FormControlLabel
                                                control={<Controller name="isVerified" control={control} render={({ field }) => (
                                                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                                                )} />}
                                                label="Verified User"
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CustomTabPanel>

                    <CustomTabPanel value={tabValue} index={1}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Date of Birth (YYYYMMDD)"
                                    fullWidth
                                    {...register("dateOfBirth")}
                                    placeholder="e.g. 19900101"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    label="Gender"
                                    fullWidth
                                    {...register("gender")}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    label="Blood Group"
                                    fullWidth
                                    {...register("bloodGroup")}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                        <MenuItem key={group} value={group}>{group}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Height (cm)"
                                    type="number"
                                    fullWidth
                                    {...register("height", { valueAsNumber: true })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Weight (kg)"
                                    type="number"
                                    fullWidth
                                    {...register("weight", { valueAsNumber: true })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }}><Typography variant="caption" color="textSecondary">Emergency Contact</Typography></Divider>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="EC Name"
                                    fullWidth
                                    {...register("emergencyContact.name")}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="EC Phone"
                                    fullWidth
                                    {...register("emergencyContact.phone")}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Relationship"
                                    fullWidth
                                    {...register("emergencyContact.relationship")}
                                />
                            </Grid>
                        </Grid>
                    </CustomTabPanel>

                    <CustomTabPanel value={tabValue} index={2}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Street Address"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    {...register("address")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="City"
                                    fullWidth
                                    {...register("city")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="State"
                                    fullWidth
                                    {...register("state")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Pincode"
                                    fullWidth
                                    {...register("pincode")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Country"
                                    fullWidth
                                    {...register("country")}
                                />
                            </Grid>
                        </Grid>
                    </CustomTabPanel>

                    <CustomTabPanel value={tabValue} index={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Corporate ID"
                                    fullWidth
                                    {...register("corporateId")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Department"
                                    fullWidth
                                    {...register("department")}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Employee ID"
                                    fullWidth
                                    {...register("employeeId")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Permissions (Comma separated)"
                                    fullWidth
                                    placeholder="e.g. read:users, write:blogs"
                                    onChange={(e) => {
                                        const values = e.target.value.split(',').map(v => v.trim());
                                        setValue('permissions', values);
                                    }}
                                    defaultValue={formData.permissions?.join(', ')}
                                />
                            </Grid>
                        </Grid>
                    </CustomTabPanel>
                </DialogContent>

                <DialogActions sx={{ p: 3, bgcolor: '#fbfbfb' }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 120 }}>Cancel</Button>
                    <Box sx={{ flex: 1 }} />
                    {tabValue > 0 && (
                        <Button onClick={() => setTabValue(tabValue - 1)} variant="text" sx={{ mr: 1 }}>Previous Step</Button>
                    )}
                    {tabValue < 3 ? (
                        <Button onClick={() => setTabValue(tabValue + 1)} variant="contained" color="primary" sx={{ minWidth: 120 }}>Next Step</Button>
                    ) : (
                        <Button type="submit" variant="contained" color="success" sx={{ minWidth: 120 }}>
                            {selectedId ? "Update User" : "Create User"}
                        </Button>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddUserDialog;
