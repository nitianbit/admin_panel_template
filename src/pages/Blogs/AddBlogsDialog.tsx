import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { useForm } from "react-hook-form";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Stack,
} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { uploadFile } from "../../utils/helper";
import { MODULES } from "../../utils/constants";
import _ from "lodash";
import { showError } from "../../services/toaster";
import { useBlogStore } from "../../services/blogs";
import { BlogData } from "../../types/blogs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddBlogDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
    const { onCreate, onUpdate, detail } = useBlogStore();
    const [data, setData] = React.useState<BlogData>({
        title: "",
        author: "",
        description: "",
        image: "",
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BlogData>();

    const handleChange = (key: keyof BlogData, value: any) =>
        setData((prev) => ({ ...prev, [key]: value }));

    const handleClickOpen = () => toggleModal(true);
    const handleClose = () => toggleModal(false);

    const onSubmit = async () => {
        try {
            if (!data.title || !data.author || !data.description) {
                return showError("Please fill in all required fields");
            }

            let response: BlogData | null = null;
            const payload = _.omit(data, ["image"]);

            if (data._id) {
                response = await onUpdate(data._id, payload);
            } else {
                response = await onCreate(payload);
            }

            if (response?._id && data?.image && typeof data.image === "object") {
                const res = await uploadFile(
                    { module: MODULES.BLOGS, record_id: response._id },
                    [data.image]
                );
                if (res.status >= 200 && res.status < 400) {
                    const imagePath = res.data?.data?.length ? res.data.data[0] : "";
                    await onUpdate(response._id, { image: imagePath, _id: response._id });
                }
            }

            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDetail = async (id: string) => {
        try {
            const res = await detail(id);
            reset(res.data);
            setData(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        setData({ title: "", author: "", description: "", image: "" });
        if (selectedId) {
            fetchDetail(selectedId);
        }
    }, [selectedId]);

    return (
        <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
                    Add Blog
                </Button>
            </Stack>

            <Dialog
                open={isModalOpen}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullScreen
            >
                <form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <DialogTitle>{data._id ? "Edit Blog" : "Add Blog"}</DialogTitle>
                    <DialogContent dividers style={{ flex: 1, overflowY: "auto" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    value={data.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Author"
                                    fullWidth
                                    value={data.author}
                                    onChange={(e) => handleChange("author", e.target.value)}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <div style={{ marginTop: "1.5rem", marginBottom: 50 }}>
                            <label style={{ marginBottom: 8, display: "block", fontWeight: 500 }}>Description</label>
                            <div style={{ height: 300 }}>
                                <ReactQuill
                                    style={{ height: "100%" }}
                                    value={data.description}
                                    onChange={(value: any) => handleChange("description", value)}
                                />
                            </div>
                        </div>

                        {data.image && typeof data.image === "string" && (
                            <CustomImage
                                src={data.image}
                                style={{ width: "50%", height: 200, objectFit: "contain", marginTop: 16 }}
                            />
                        )}
                        <div style={{ marginTop: 16 }}>
                            <ImageUpload
                                onChange={(files: any) =>
                                    handleChange("image", files?.length ? files[0] : null)
                                }
                                allow="image/*"
                                multiple={false}
                            />
                        </div>
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
    );
};

export default AddBlogDialog;






// import Slide from "@mui/material/Slide";
// import { TransitionProps } from "@mui/material/transitions";
// import React from "react";
// import { useForm } from "react-hook-form";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Stack,
//   TextField,
// } from "@mui/material";
// import SearchInput from "../../components/SearchInput";
// import AddIcon from "@mui/icons-material/Add";
// import CustomImage from "../../components/CustomImage";
// import ImageUpload from "../../components/ImageUploader";
// import { uploadFile } from "../../utils/helper";
// import { MODULES } from "../../utils/constants";
// import _ from "lodash";
// import { showError } from "../../services/toaster"; 
// import { useBlogStore } from "../../services/blogs";
// import { BlogData } from "../../types/blogs";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';



// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const AddBlogDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
//   const { onCreate, onUpdate, detail } = useBlogStore();
//   const [data, setData] = React.useState<BlogData>({
//     title: "",
//     author: "",
//     description: "",
//     image: "",
//   });

//   const { register, handleSubmit, formState: { errors }, reset } = useForm<BlogData>();

//   const handleChange = (key: keyof BlogData, value: any) => setData((prev) => ({ ...prev, [key]: value }));
//   const handleClickOpen = () => toggleModal(true);
//   const handleClose = () => toggleModal(false);

//   const onSubmit = async () => {
//     try {
//       if (!data.title || !data.author || !data.description) {
//         return showError("Please fill in all required fields");
//       }

//       let response: BlogData | null = null;
//       const payload = _.omit(data, ['image']);

//       if (data._id) {
//         response = await onUpdate(data._id, payload);
//       } else {
//         response = await onCreate(payload);
//       }

//       if (response?._id && data?.image && typeof data.image === "object") {
//         const res = await uploadFile({ module: MODULES.BLOGS, record_id: response?._id }, [data.image]);
//         if (res.status >= 200 && res.status < 400) {
//           const imagePath = res.data?.data?.length ? res.data.data[0] : "";
//           await onUpdate(response._id, { image: imagePath });
//         }
//       }

//       handleClose();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchDetail = async (id: string) => {
//     try {
//       const res = await detail(id);
//       reset(res.data);
//       setData(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   React.useEffect(() => {
//     setData({ title: "", author: "", description: "", image: "" });
//     if (selectedId) {
//       fetchDetail(selectedId);
//     }
//   }, [selectedId]);

//   return (
//     <>
//       <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
//         <SearchInput />
//         <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
//           Add Blog
//         </Button>
//       </Stack>

//       <Dialog
//         open={isModalOpen}
//         onClose={handleClose}
//         TransitionComponent={Transition}
//         maxWidth="xl"
//         fullWidth
//       >
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogTitle>{data._id ? "Edit Blog" : "Add Blog"}</DialogTitle>
//           <DialogContent dividers>
//             <TextField
//               margin="dense"
//               label="Title"
//               fullWidth
//               value={data.title}
//               onChange={(e) => handleChange("title", e.target.value)}
//               required
//             />
//             <TextField
//               margin="dense"
//               label="Author"
//               fullWidth
//               value={data.author}
//               onChange={(e) => handleChange("author", e.target.value)}
//               required
//             />
//             <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
//               <label style={{ marginBottom: 8, display: "block" }}>Description</label>
//               <ReactQuill
//                 value={data.description}
//                 onChange={(value: any) => handleChange("description", value)}
//               />
//             </div>

//             {data.image && typeof data.image === "string" && (
//               <CustomImage
//                 src={data.image}
//                 style={{ width: "50%", height: 200, objectFit: "contain" }}
//               />
//             )}
//             <ImageUpload
//               onChange={(files: any) => handleChange("image", files?.length ? files[0] : null)}
//               allow="image/*"
//             />
//           </DialogContent>

//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type="submit" variant="contained">
//               Submit
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>
//     </>
//   );
// };

// export default AddBlogDialog;
