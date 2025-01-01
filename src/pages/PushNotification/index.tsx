import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Button,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import Layout from "../../components/Layout";

const PushNotification = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState("all");
    const [platforms, setPlatforms] = useState({
        android: false,
        ios: false
    });

    const handlePlatformChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlatforms({ ...platforms, [event.target.name]: event.target.checked });
    };

    const handleSubmit = () => {
        console.log({
            title,
            message,
            audience,
            platforms,
        });
        alert("Notification sent!");
    };

    return (
        <Layout appBarTitle="Patient">

            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Send Push Notification
                </Typography>
                <Grid container spacing={3}>
                    {/* Notification Form */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                {/* Title */}
                                <TextField
                                    fullWidth
                                    label="Notification Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    margin="dense"
                                    variant="outlined"
                                />

                                {/* Message */}
                                <TextField
                                    fullWidth
                                    label="Notification Message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    margin="dense"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />


                                {/* <FormControl fullWidth margin="dense">
                                    <InputLabel id="audience-select-label">Target Audience</InputLabel>
                                    <Select
                                        labelId="audience-select-label"
                                        value={audience}
                                        onChange={(e) => setAudience(e.target.value)}
                                    >
                                        <MenuItem value="all">All Users</MenuItem>
                                        <MenuItem value="admins">Admins</MenuItem>
                                        <MenuItem value="subscribers">Subscribers</MenuItem>
                                    </Select>
                                </FormControl> */}


                                {/* <Typography variant="subtitle1" gutterBottom>
                                    Target Platforms
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={platforms.android}
                                            onChange={handlePlatformChange}
                                            name="android"
                                        />
                                    }
                                    label="Android"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={platforms.ios}
                                            onChange={handlePlatformChange}
                                            name="ios"
                                        />
                                    }
                                    label="iOS"
                                /> */}

                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Preview */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Preview
                                </Typography>
                                <Box
                                    sx={{
                                        border: "1px solid #ccc",
                                        borderRadius: 2,
                                        p: 2,
                                        bgcolor: "#f9f9f9",
                                    }}
                                >
                                    <Typography variant="subtitle1" gutterBottom>
                                        {title || "Notification Title"}
                                    </Typography>
                                    <Typography variant="body1"
                                        sx={{
                                            display: "-webkit-box",  
                                            WebkitLineClamp: 3, 
                                            WebkitBoxOrient: "vertical",  
                                            overflow: "hidden",  
                                            textOverflow: "ellipsis", 
                                        }}
                                    >
                                        {message || "This is the notification message."}
                                    </Typography>
                                </Box>
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
                            Send Notification
                        </Button>
                    </Grid>
                </Grid>
            </Box>



        </Layout>

    );
};

export default PushNotification;
