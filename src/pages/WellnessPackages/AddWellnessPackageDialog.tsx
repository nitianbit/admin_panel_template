import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react';
import { useForm } from "react-hook-form";
import SearchInput from "../../components/SearchInput";

import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { showError } from "../../services/toaster";
import { TestCategory, WellnessPackage } from "../../types/WellnessPackage";
import { MODULES } from "../../utils/constants";
import { uploadFile } from "../../utils/helper";
import { useWellnessPackageStore } from "../../services/wellnessPackages";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialData: WellnessPackage = {
    name: "",
    description: "",
    bookingProcedure: "",
    imageUrl: "",
    originalPrice: 0,
    discountedPrice: 0,
    totalTestsCount: 0,
    hasFreeDoctorConsultation: false,
    testsIncluded: [],
    category: "",
    isActive: true,
    isPopular: false,
    order: 0,
};

const AddWellnessPackageDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, detail, onUpdate, filters, setFilters } = useWellnessPackageStore();
    const [data, setData] = React.useState<WellnessPackage>({ ...initialData });
    const { handleSubmit } = useForm<WellnessPackage>();
    const resetData = () => setData({ ...initialData });

    const imageFileRef = React.useRef<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = React.useState<string>("");
    const [newSubTestInput, setNewSubTestInput] = React.useState<{ [key: number]: string }>({});

    const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    // Filter states
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilters = (query: string) => {
        const newFilters: any = { ...filters };

        if (query.trim()) {
            const searchTerm = query.trim().toLowerCase();

            // Common wellness package categories to check against
            const CATEGORIES = [
                'Full Body', 'Men', 'Women', 'Senior Citizen', 'Kids',
                'Cardiac', 'Diabetic', 'Basic', 'Advanced', 'Comprehensive',
                'General', 'Pregnancy', 'Vitamin', 'Immunity', 'Fever'
            ];

            const matchedCategory = CATEGORIES.find(
                c => c.toLowerCase().includes(searchTerm) || searchTerm.includes(c.toLowerCase())
            );

            if (matchedCategory) {
                // If search term matches a known category, filter by category
                newFilters.category = matchedCategory;
                delete newFilters.name;
            } else {
                // Otherwise, perform a regular name search
                newFilters.name = query.trim();
                delete newFilters.category;
            }
        } else {
            delete newFilters.name;
            delete newFilters.category;
            delete newFilters.search;
        }

        setFilters(newFilters);
    };

    const handleSearchChange = (e: any) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters(value);
        }, 300);
    };

    // --- Test Category helpers ---
    const addTestCategory = () => {
        setData(prev => ({
            ...prev,
            testsIncluded: [
                ...prev.testsIncluded,
                { categoryName: "", categoryTestsCount: 0, subTests: [] }
            ]
        }));
    };

    const removeTestCategory = (index: number) => {
        setData(prev => {
            const updated = [...prev.testsIncluded];
            updated.splice(index, 1);
            const totalTests = updated.reduce((sum, cat) => sum + cat.subTests.length, 0);
            return { ...prev, testsIncluded: updated, totalTestsCount: totalTests };
        });
    };

    const updateCategoryName = (index: number, name: string) => {
        setData(prev => {
            const updated = [...prev.testsIncluded];
            updated[index] = { ...updated[index], categoryName: name };
            return { ...prev, testsIncluded: updated };
        });
    };

    const addSubTest = (catIndex: number) => {
        const testName = (newSubTestInput[catIndex] || "").trim();
        if (!testName) return;

        setData(prev => {
            const updated = [...prev.testsIncluded];
            const newSubTests = [...updated[catIndex].subTests, testName];
            updated[catIndex] = {
                ...updated[catIndex],
                subTests: newSubTests,
                categoryTestsCount: newSubTests.length,
            };
            const totalTests = updated.reduce((sum, cat) => sum + cat.subTests.length, 0);
            return { ...prev, testsIncluded: updated, totalTestsCount: totalTests };
        });

        setNewSubTestInput(prev => ({ ...prev, [catIndex]: "" }));
    };

    const removeSubTest = (catIndex: number, subTestIndex: number) => {
        setData(prev => {
            const updated = [...prev.testsIncluded];
            const newSubTests = [...updated[catIndex].subTests];
            newSubTests.splice(subTestIndex, 1);
            updated[catIndex] = {
                ...updated[catIndex],
                subTests: newSubTests,
                categoryTestsCount: newSubTests.length,
            };
            const totalTests = updated.reduce((sum, cat) => sum + cat.subTests.length, 0);
            return { ...prev, testsIncluded: updated, totalTestsCount: totalTests };
        });
    };

    const onSubmit = async () => {
        if (!data?.name) {
            showError('Please enter a name');
            return;
        }

        if (!data.testsIncluded || data.testsIncluded.length === 0) {
            showError('Please add at least one test category');
            return;
        }

        for (let i = 0; i < data.testsIncluded.length; i++) {
            const cat = data.testsIncluded[i];
            if (!cat.categoryName.trim()) {
                showError(`Please enter a name for test category ${i + 1}`);
                return;
            }
            if (cat.subTests.length === 0) {
                showError(`Please add at least one sub-test in "${cat.categoryName}"`);
                return;
            }
        }

        let imageUrl = existingImageUrl || "";
        if (imageFileRef.current instanceof File) {
            const uploadRes = await uploadFile({ module: MODULES.WELLNESS_PACKAGE }, [imageFileRef.current]);
            if (uploadRes.error) {
                showError(uploadRes.message || 'Failed to upload image');
                return;
            }
            const uploadedFiles = uploadRes.data?.data?.files;
            if (uploadedFiles?.length && uploadedFiles[0]?.url) {
                imageUrl = uploadedFiles[0].url;
            }
        }

        const payload: any = {
            name: data.name,
            description: data.description || "",
            bookingProcedure: data.bookingProcedure || "",
            originalPrice: data.originalPrice,
            discountedPrice: data.discountedPrice,
            totalTestsCount: data.totalTestsCount,
            hasFreeDoctorConsultation: data.hasFreeDoctorConsultation,
            testsIncluded: data.testsIncluded,
            category: data.category || "",
            isActive: data.isActive ?? true,
            isPopular: data.isPopular ?? false,
            order: data.order ?? 0,
            ...(imageUrl && { imageUrl }),
        };

        let response = null;
        if (data?._id) {
            payload._id = data._id;
            response = await onUpdate(payload);
        } else {
            response = await onCreate(payload);
        }

        if (response) {
            resetData();
            imageFileRef.current = null;
            setExistingImageUrl("");
            setNewSubTestInput({});
            handleClose();
        }
    };

    const fetchDetail = async (selectedId: string) => {
        try {
            const res = await detail(selectedId);
            setData(res?.data);
            if (res?.data?.imageUrl && typeof res.data.imageUrl === 'string') {
                setExistingImageUrl(res.data.imageUrl);
            }
        } catch (error) {

        }
    }

    React.useEffect(() => {
        setData({ ...initialData });
        imageFileRef.current = null;
        setExistingImageUrl("");
        setNewSubTestInput({});
        if (selectedId) {
            fetchDetail(selectedId);
        }
    }, [selectedId]);

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <SearchInput handleChange={handleSearchChange} />
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                    Add Wellness Package
                </Button>
            </Stack>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                maxWidth="lg"
                fullWidth
                sx={{ height: "100%" }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{data?._id ? 'Edit Wellness Package' : 'Add Wellness Package'}</DialogTitle>
                    <DialogContent dividers>

                        <TextField
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />

                        <TextField
                            margin="dense"
                            id="description"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={data.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />

                        <TextField
                            margin="dense"
                            id="bookingProcedure"
                            label="Booking Procedure"
                            type="text"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={data.bookingProcedure}
                            onChange={(e) => handleChange("bookingProcedure", e.target.value)}
                        />

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="originalPrice"
                                label="Original Price"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.originalPrice}
                                onChange={(e) => handleChange("originalPrice", Number(e.target.value))}
                            />
                            <TextField
                                margin="dense"
                                id="discountedPrice"
                                label="Discounted Price"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.discountedPrice}
                                onChange={(e) => handleChange("discountedPrice", Number(e.target.value))}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="totalTestsCount"
                                label="Total Tests Count"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.totalTestsCount}
                                InputProps={{ readOnly: true }}
                            />
                            <TextField
                                margin="dense"
                                id="category"
                                label="Category"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={data.category}
                                onChange={(e) => handleChange("category", e.target.value)}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                margin="dense"
                                id="order"
                                label="Order"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={data.order}
                                onChange={(e) => handleChange("order", Number(e.target.value))}
                            />
                        </Stack>

                        {/* Tests Included Section */}
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                                Tests Included ({data.totalTestsCount} total tests)
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={addTestCategory}
                            >
                                Add Category
                            </Button>
                        </Stack>

                        {data.testsIncluded.map((category: TestCategory, catIndex: number) => (
                            <Box
                                key={catIndex}
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TextField
                                        margin="dense"
                                        label="Category Name"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={category.categoryName}
                                        onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                                        placeholder="e.g. Blood Tests, Imaging"
                                    />
                                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                        {category.subTests.length} tests
                                    </Typography>
                                    <IconButton
                                        color="error"
                                        onClick={() => removeTestCategory(catIndex)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>

                                {/* Sub-tests chips */}
                                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                                    {category.subTests.map((subTest: string, subIndex: number) => (
                                        <Chip
                                            key={subIndex}
                                            label={subTest}
                                            onDelete={() => removeSubTest(catIndex, subIndex)}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>

                                {/* Add sub-test input */}
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
                                    <TextField
                                        size="small"
                                        label="Add Sub Test"
                                        variant="outlined"
                                        fullWidth
                                        value={newSubTestInput[catIndex] || ""}
                                        onChange={(e) =>
                                            setNewSubTestInput(prev => ({ ...prev, [catIndex]: e.target.value }))
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSubTest(catIndex);
                                            }
                                        }}
                                        placeholder="e.g. CBC, Lipid Profile"
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => addSubTest(catIndex)}
                                        sx={{ whiteSpace: 'nowrap' }}
                                    >
                                        Add
                                    </Button>
                                </Stack>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.hasFreeDoctorConsultation ?? false}
                                        onChange={(e) => handleChange("hasFreeDoctorConsultation", e.target.checked)}
                                    />
                                }
                                label="Free Consultation"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.isActive ?? true}
                                        onChange={(e) => handleChange("isActive", e.target.checked)}
                                    />
                                }
                                label="Active"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.isPopular ?? false}
                                        onChange={(e) => handleChange("isPopular", e.target.checked)}
                                    />
                                }
                                label="Popular"
                            />
                        </Stack>

                        {existingImageUrl ? <CustomImage src={existingImageUrl} style={{ width: '50%', height: 200, objectFit: 'contain', marginTop: 16 }} /> : null}
                        <ImageUpload
                            onChange={(files: any) => {
                                imageFileRef.current = files?.length ? files[0] : null;
                                if (files?.length) {
                                    setExistingImageUrl("");
                                }
                            }}
                            allow="image/*"
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </>
    )
}

export default AddWellnessPackageDialog
