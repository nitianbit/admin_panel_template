import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect } from "react";
import { useBlogStore } from "../../../services/blogs";

interface Props {
  value?: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
}

const BlogMultiSelect: React.FC<Props> = ({
  value = [],
  onChange,
  multiple = true,
}) => {
  const {
    data,
    fetchGrid,
    currentPage,
    rows,
    isLoading,
  } = useBlogStore();

  useEffect(() => {
    // Fetch only once initially
    if (!data.length && !isLoading) {
      fetchGrid();
    }
  }, []);

  const renderSelectedValue = (selected: string[]) =>
    selected
      .map((id) => {
        const blog = data.find((b) => b._id === id);
        return blog ? blog.title : id;
      })
      .join(", ");

  return (
    <FormControl fullWidth margin="dense">
      <InputLabel id="blog-multi-label">Blogs</InputLabel>
      <Select
        labelId="blog-multi-label"
        multiple={multiple}
        value={value}
        onChange={(e) => onChange(e.target.value as string[])}
        renderValue={renderSelectedValue}
      >
        {data.map((blog: any) => (
          <MenuItem key={blog._id} value={blog._id}>
            <Checkbox checked={value.includes(blog._id)} />
            <ListItemText primary={blog.title} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BlogMultiSelect;
