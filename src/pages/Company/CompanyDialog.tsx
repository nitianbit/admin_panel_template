import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Stack, Switch } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "../../components/SearchInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Company } from "../../types/company";
import { useCompanyStore } from "../../services/company";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CompanyDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {

  const { onCreate,detail,onUpdate } = useCompanyStore();

  const [comapnyData, setCompanyData] = React.useState<Company>({
    name: "",
    email: "",
    phone: null,
    contactPerson: "",
    noOfEmployees: 0,
    website: "",
    isActive: true,
    contactperson: "",
    noOfUser: 0
  })
   const handleChange = (key: any, value: any) =>  setCompanyData({ ...comapnyData, [key]: value });
  const handleClickOpen = () => toggleModal(true);
  const handleClose = () => toggleModal(false);

  const handleSave = async () => {
    const {name,contactperson,email,phone,website}=comapnyData;
    if(!name || !contactperson || !email || !phone || !website){
      toast.error("All fields are required")
      return
    }
    if(comapnyData?._id){
      onUpdate(comapnyData);
     }else{
       onCreate(comapnyData);
     }
    handleClose()
  }
  
    const fetchDetail=async(selectedId:string)=>{
      try {
        const data=await detail(selectedId);
        setCompanyData(data?.data)
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
          Add Company
        </Button>
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        sx={{ height: "100%" }}
      >

        <form onSubmit={handleSave}>
          <DialogTitle>Company Details</DialogTitle>

          <DialogContent dividers>
            <TextField
              margin="dense"
              id="name"
              label="Company Name"
              type="name"
              required
              fullWidth
              variant="outlined"
              value={comapnyData?.name}
              onChange={(e) => handleChange("name", e.target.value)}

            />

            <TextField
              margin="dense"
              id="phone"
              label="Phone no"
              type="phone"
              fullWidth
              variant="outlined"
              placeholder="0 123456789"
              value={comapnyData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Company Email"
              type="email"
              fullWidth
              variant="outlined"
              placeholder="Enter Company Email"
              value={comapnyData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <TextField
              id="website"
              margin="dense"
              type="website"
              fullWidth
              required
              label="Company Website"
              variant="outlined"
              value={comapnyData?.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
            <TextField
              margin="dense"
              fullWidth
              required
              label="Contact Person Name"
              variant="outlined"
              value={comapnyData?.contactperson}
              onChange={(e) => handleChange("contactperson", e.target.value)}
            />
            <TextField
              margin="dense"
              label="Number Of Users"
              fullWidth
              variant="outlined"
              placeholder="Enter Number Of Users"
              value={comapnyData.noOfUser}
              onChange={(e) => handleChange("noOfUser", e.target.value)}
            />

            {/* <FormControl fullWidth margin="dense"> */}
            <InputLabel id="paymentStatus">Is Active</InputLabel>
            <Switch
              checked={comapnyData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            {/* </FormControl> */}
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
