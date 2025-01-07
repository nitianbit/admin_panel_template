import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    FormControl,
    Button,
    Grid,
    Card,
    CardContent,
    InputLabel,
    FormHelperText,
    IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Layout from "../../components/Layout";
import DateTimePickerWithInterval from "../../components/DateTimePicker";
import moment from "moment";
import { doGET, doPOST, doPUT } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";
import { Wellness } from "../../types/wellness";
import { useCompanyStore } from "../../services/company";
import { showError } from "../../services/toaster";
import { uploadFile } from "../../utils/helper";
import CustomImage from "../../components/CustomImage";



interface ImageFile extends File {
    preview?: string;
}

const WellnessForm = () => {
    const [data, setData] = useState<Wellness>({
        title: "",
        description: "",
        startTime: moment().unix(),
    })
    const [images, setImages] = useState<ImageFile[]>([]);
    const { globalCompanyId } = useCompanyStore();

    const fetchWellness = async (companyId: string) => {
        try {
            const res = await doGET(`${ENDPOINTS.grid('wellness')}?company=${companyId}&page=1&rows=1&sortBy=_id&sortAsc=false`);
            //TODO improve it
            if (res.data?.data?.rows?.length) {
                setData(res.data?.data?.rows[0]);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        if (globalCompanyId) {
            fetchWellness(globalCompanyId)
        }
    }, [globalCompanyId])

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files ? Array.from(event.target.files) : [];

        // Filter only image files
        const validImages = files.filter((file) => file.type.startsWith("image/"));

        // Limit to 4 images
        if (validImages.length + images.length > 4) {
            alert("You can upload a maximum of 4 images.");
            return;
        }

        const imageFiles = validImages.map((file) => {
            const imageFile: ImageFile = file;
            imageFile.preview = URL.createObjectURL(file);
            return imageFile;
        });

        setImages((prevImages) => [...prevImages, ...imageFiles]);
    };

    const handleImageDelete = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            if (!globalCompanyId) {
                showError('Please select a company');
                return;
            }
            const { title, description, startTime } = data;
            const response = await doPOST(ENDPOINTS.create('wellness'), {
                title,
                description,
                startTime,
                company: globalCompanyId
            })
            if (response.status >= 200 && response.status < 400 && images.length) {
                //upload iamge and get url and append
                setData(response?.data?.data);
                const res = await uploadFile({ module: 'wellness', record_id: response?.data?.data?._id }, images);
                if (res.status >= 200 && res.status < 400) {
                    const imagePaths = res.data?.data?.length ? res.data?.data : [];
                    await doPUT(ENDPOINTS.update('wellness'), { images: imagePaths, _id: response?.data?.data?._id });
                    fetchWellness(globalCompanyId);
                }
                //upload Image
            }
        } catch (error) {

        }
    };

    const handleChange = (key: string, value: string | number) => {
        setData((prev) => {
            return { ...prev, [key]: value }
        })
    }

    return (
        <Layout appBarTitle="Wellness">
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Create Wellness Event
                </Typography>
                <Grid container spacing={3}>
                    {/* Form Section */}
                    <Grid item xs={12} >
                        <Card>
                            <CardContent>
                                {/* Title */}
                                <TextField
                                    fullWidth
                                    label="Event Title"
                                    value={data.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    margin="dense"
                                    variant="outlined"
                                />

                                {/* Description */}
                                <TextField
                                    fullWidth
                                    label="Event Description"
                                    value={data.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    margin="dense"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />

                                {
                                    data?.images?.length && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, borderWidth: 1, borderColor: '#bbb', borderStyle: 'solid', padding: 10, borderRadius: 20, margin: '10px 0' }}>
                                            {data?.images?.map((image, index) => <CustomImage key={image} src={image} style={{ width: 200, height: 100, objectFit: 'contain' }} />)}
                                        </div>
                                    )
                                }

                                {/* Image Upload */}
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Upload Images</InputLabel>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        multiple
                                        onChange={handleImageUpload}
                                        style={{ display: "none" }}
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            component="span"
                                            fullWidth
                                        >
                                            Upload Images (Max 4)
                                        </Button>
                                    </label>
                                    <FormHelperText>
                                        {images.length > 0
                                            ? `${images.length} image(s) selected`
                                            : "No images selected"}
                                    </FormHelperText>
                                </FormControl>

                                {/* Display Uploaded Images */}
                                <Box mt={2} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                    {images.map((image, index) => (
                                        <Box key={index} sx={{ position: "relative" }}>
                                            <img
                                                src={image.preview}
                                                alt="Uploaded Preview"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ccc",
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 0,
                                                    backgroundColor: "white",
                                                }}
                                                onClick={() => handleImageDelete(index)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>

                                <DateTimePickerWithInterval
                                    value={data.startTime} // Pass timestamp value
                                    onChange={(newTimestamp: number) => handleChange('startTime', newTimestamp)}
                                    placeholder="Select Date and Time"
                                    showTimeSelect={true}
                                />

                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                        >
                            Submit Event
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default WellnessForm;
