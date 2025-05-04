import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import { MARKETING } from "../../types/marketing";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";
import { useMARKETINGStore } from "../../services/marketing";
import { showError } from "../../services/toaster";



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMARKETINGDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {

  const { onCreate,detail,onUpdate } = useMARKETINGStore();
  const [hRData, setMARKETINGData] = React.useState<MARKETING>({
    name:"",
    email:"",
    role:["marketing"],
    phone:"",
    company:"",
  })

  const handleChange = (key: any, value: any) => {
    setMARKETINGData({ ...hRData, [key]: value });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MARKETING>();

  const handleClickOpen = () => {
    toggleModal(true);
  };

  const handleClose = () => {
    toggleModal(false);
    setMARKETINGData({
      name:"",
      email:"",
      phone:"",
      role:["hr"],
      company:""
    })
  };

  const onSubmit = () => {
    if(!hRData.company || !hRData.email || !hRData.name || !hRData.phone){
      return showError("All fields are required")
    }
    if(hRData?._id){
     onUpdate(hRData);
    }else{
      onCreate(hRData);
    }
    handleClose();
  };

  const fetchDetail=async(selectedId:string)=>{
    try {
      const data=await detail(selectedId);
      reset(data?.data)
      setMARKETINGData(data?.data)
    } catch (error) {
      
    }
  }

  React.useEffect(() => {
    if (selectedId) {
     fetchDetail(selectedId)
    }
  }, [selectedId]);

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <SearchInput />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add MARKETING
        </Button>
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{ height: "100%" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add MARKETING</DialogTitle>

          <DialogContent dividers>
            <TextField
              margin="dense"
              id="name"
              label="Full Name"
              type="name"
              fullWidth
              required
              variant="outlined"
              value={hRData.name} 
              onChange={(e) => handleChange("name", e.target.value)}
               />

            <CompanySelect  value={hRData.company} onChange={(value)=>{
              handleChange("company", value)
            }} module={MODULES.MARKETING} />

            <TextField
              margin="dense"
              id="phone"
              required
              label="Phone no"
              type="phone"
              fullWidth
              variant="outlined"
              placeholder="0 123456789"
              value={hRData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              margin="dense"
              id="email"
              required
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              placeholder="ex: test@test.com"
              value={hRData.email}
              onChange={(e) => handleChange("email", e.target.value)}
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
    </div>
  );
}
