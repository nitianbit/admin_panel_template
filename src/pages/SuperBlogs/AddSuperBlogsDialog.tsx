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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import { useSuperBlogStore } from "../../services/superblogs";
import { SuperBlogData } from "../../types/superblogs";
import BlogMultiSelect from "../../components/DropDowns/BlogMultiSelect/BlogMultiSelect";
import CustomImage from "../../components/CustomImage";
import ImageUpload from "../../components/ImageUploader";
import { uploadFile } from "../../utils/helper";
import { MODULES } from "../../utils/constants";
import { showError } from "../../services/toaster";
import _ from "lodash";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddSuperBlogDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
  const { onCreate, detail, onUpdate } = useSuperBlogStore();

  const [data, setData] = React.useState<SuperBlogData>({
    title: "",
    author: "",
    date: "",
    blogs: [],
    image: "",
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SuperBlogData>();

  const handleChange = (key: keyof SuperBlogData, value: any) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleClickOpen = () => toggleModal(true);
  const handleClose = () => {
    toggleModal(false);
    setData({ title: "", author: "", date: "", blogs: [], image: "" });
  };

  const onSubmit = async () => {
    try {
      if (!data.blogs?.length) {
        return showError("Please select at least one blog");
      }

      let response: SuperBlogData | null = null;
      const payload: any = _.cloneDeep(data);

      if (typeof data.image !== "string") {
        delete payload.image;
      }

      if (data._id) {
        response = await onUpdate(data._id,payload);
      } else {
        response = await onCreate(payload);
      }

      if (response?._id && data.image && typeof data.image === "object") {
        const res = await uploadFile({ module: MODULES.SUPERBLOGS, record_id: response._id }, [data.image]);
        console.log(JSON.stringify(res,null,2));
        if (res.status >= 200 && res.status < 400) {
          const imagePath = res.data?.data?.[0] || "";
          await onUpdate(response._id,{ _id: response._id, image: imagePath });
        }
      }

      handleClose();
    } catch (error) {
      showError("Something went wrong");
    }
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const result = await detail(selectedId);
      reset(result?.data);
      setData(result?.data);
    } catch (error) {
      showError("Failed to fetch superblog details");
    }
  };

  React.useEffect(() => {
    setData({ title: "", author: "", date: "", blogs: [], image: "" });
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <SearchInput />
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Add SuperBlog
        </Button>
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{data._id ? "Edit" : "Add"} SuperBlog</DialogTitle>
          <DialogContent dividers>
            <TextField
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              margin="dense"
              label="Author"
              fullWidth
              variant="outlined"
              value={data.author}
              onChange={(e) => handleChange("author", e.target.value)}
              error={!!errors.author}
              helperText={errors.author?.message}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={data.date}
              onChange={(e) => handleChange("date", e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date?.message}
            />

            <BlogMultiSelect
              value={data.blogs}
              onChange={(value: string[]) => handleChange("blogs", value)}
              multiple
            />

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Upload Image
            </Typography>
            {data.image && typeof data.image === "string" && (
              <CustomImage
                src={data.image}
                style={{ marginTop: 10, maxHeight: 150, borderRadius: 8 }}
              />
            )}
            <ImageUpload
              onChange={(files: File[]) => handleChange("image", files?.[0] || "")}
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
  );
};

export default AddSuperBlogDialog;
