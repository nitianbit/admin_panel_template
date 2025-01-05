import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { MenuItem, Select } from "@mui/material";
import { useAppContext } from "../../services/context/AppContext";
import { doPOST } from "../../utils/HttpUtils";
import { isError } from "../../utils/helper";
import { AUTHENDPOINTS } from "../../EndPoints/Auth";
import { OTP } from "../../components/OTP/OTP";

type FormValues = {
  name: string;
  email: string;
  role: string
};

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<FormValues>();
  const { success, error, setIsLoggedIn, isLoggedIn } = useAppContext()
  const onSubmit = (data: FormValues) => console.log(data);

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    role: "doctors",
    email: ""
  });

  const [otp, setOTP] = useState("")
  const [isOTPSend, setIsOTPSend] = useState(false);
  const [otpData, setOtpData] = useState({ otp: ''.padEnd(4, ' ') });

  const handleChange = (key: any, value: any) => {
    setData((prev) => {
      return { ...prev, [key]: value };
    });
  }


  const VerifyOTP = async () => {
    try {
      if (otp.length != 4) {
        error("Please enter 4 digit OTP")
        return;
      }

      const updatedOTpData = {
        ...otpData,
        otp: otp,
        role:data.role,
        isTokenRequired:false,
      };
      setOtpData(updatedOTpData)
      const response = await doPOST(AUTHENDPOINTS.verifyotp, updatedOTpData);
      if (response.status >= 200 && response.status < 300) {
        success("Register Successfully")
        navigate(`/login`)
      }else if (response.status >= 400 && response.status <= 500) {
        error(response.message)
      }
    } catch (e) {
      if (isError(e)) {
        console.log(e);
      }

    }
  }

  const sendOTP = async (userData: any) => {
    try {
      const response = await doPOST(AUTHENDPOINTS.sentotp, userData);
      if (response.status >= 200 && response.status < 300) {
        // navigate(`/otp`)
        setIsOTPSend(true)
        setOtpData((prev: any) => ({
          ...prev,
          otpId: response.data.data.otpId,
          userId: response.data.data.userId
        }))
        success("OTP Send Successfully")
      }else if (response.status >= 400 && response.status <= 500) {
        error(response.message)
      }
    } catch (e) {
      if (isError(e)) {
        console.log(e.message);
      }
    }
  }


  const signUp = async () => {
    try {
      if (!data.email || !data.name || !data.role) {
        error("Please enter required fields")
        return;
      }
      const response = await doPOST(AUTHENDPOINTS.signup, data);
      if (response.status >= 200 && response.status < 300) {
        await sendOTP(response.data.data);
      } else if (response.status >= 400 && response.status <= 500) {
        error(response.message)
      }
    } catch (e) {
      if (isError(e)) {
        console.log(e);
      }
    }
  }

  const handleSendButton = async () => {
    if (isOTPSend) {
      await VerifyOTP();
    } else {
      await signUp();
    }
  }


  return (
    <Container component="main" maxWidth="xs" sx={{ height: "80vh" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box sx={{ mt: 3 }}>

          {isOTPSend ?   <OTP separator={<span>-</span>} value={otp} onChange={setOTP} length={4} /> :
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                //autoComplete="given-name"
                //name="firstName"
                //required
                fullWidth
                id="name"
                label="Name"
                //autoFocus
                onChange={(e: any) => {
                  handleChange("name", e?.target?.value)
                }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                //required
                fullWidth
                id="email"
                label="Email Address"
                //name="email"
                //autoComplete="email"
                onChange={(e: any) => {
                  handleChange("email", e?.target?.value)
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                labelId="role"
                id="role"
                label="Roles"
                onChange={(e: any) => {
                  handleChange("role", e?.target?.value)
                }}
                defaultValue={"doctors"}
                error={!!errors.role}
              >
                <MenuItem value={"doctors"}>Doctor</MenuItem>
                <MenuItem value={"laboratories"}>Laboratory</MenuItem>
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"supervisor"}>Super Visor</MenuItem>
              </Select>
            </Grid>
          </Grid>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSendButton}
          >
           {isOTPSend ? "Verify Otp" : "Send OTP"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to={"/login"}
                style={{
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          <DevTool control={control} /> {/* set up the dev tool */}
        </Box>
      </Box>
    </Container>
  );
}
