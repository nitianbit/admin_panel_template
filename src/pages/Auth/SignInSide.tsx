import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
//import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import HeartRateLoader from "../../components/HeartRateLoader";
import { useForm } from "react-hook-form";
import ToggleButton from "../../components/Toggle/ToggleButton";
import { doPOST } from '../../utils/HttpUtils'
import { AUTHENDPOINTS } from "../../EndPoints/Auth";
import { useAppContext } from "../../services/context/AppContext";
import { OTP } from "../../components/OTP/OTP";
import { isError } from "../../utils/helper";
import { setValue, STORAGE_KEYS } from "../../services/Storage";

type FormValues = {
  email: string;
  password: string;
};

export default function SignInSide() {

  const { success, error, setIsLoggedIn, isLoggedIn } = useAppContext()

  const [loading, setLoading] = useState(false);
  const [isOTPSend, setIsOTPSend] = useState(false);
  const [data, setData] = useState({
    role: "doctors",
    email: ""
  });

  const [otp, setOTP] = useState("")

  const [otpData, setOtpData] = React.useState({ otp: ''.padEnd(4, ' ') });

  const navigate = useNavigate();
  const {
    register,
    formState: { errors }
  } = useForm<FormValues>();

  const options = ['doctors', 'laboratories', "admin", 'superadmin'];

  const handleRoleSelect = (role: any) => {
    setData((prev) => {
      return { ...prev, role: role };
    });
  };

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
        isTokenRequired:true
      };
      setOtpData(updatedOTpData)
      const response = await doPOST(AUTHENDPOINTS.verifyotp, updatedOTpData);
      if (response.status >= 200 && response.status < 300) {
        success("Login Successfully")
        setIsLoggedIn(true)
        setValue(STORAGE_KEYS.TOKEN, response.data)
        navigate(`/dashboard`)
      }
      else if (response.status >= 400 && response.status <= 500) {
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

  const signIn = async () => {
    try {
      if (!data.email) {
        error("Please enter email")
        return;
      }
      const response = await doPOST(AUTHENDPOINTS.login, data);
      if (response.status >= 200 && response.status < 300) {
        await sendOTP(response.data.data);
      }else if(response.status >= 400 && response.status <= 500){
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
      await signIn();
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/dashboard`)
    }
  }, [isLoggedIn])

  return (
    <>
      {loading ? (
        <HeartRateLoader message={"Get well soon!"} />
      ) : (
        <Grid container component="main" sx={{ height: "100vh" }}>
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(../../../doctor.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>

              <Box sx={{ mt: 1 }}>
               {!isOTPSend && <ToggleButton
                  options={options}
                  onSelect={handleRoleSelect}
                  style={{
                    marginTop: 4
                  }}
                />}
                {isOTPSend ?

                  <OTP separator={<span>-</span>} value={otp} onChange={setOTP} length={4} />
                  : <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="email"
                    label="Email Address"
                    onChange={(e: any) => {
                      handleChange("email", e?.target?.value)
                    }}
                    // name="email"
                    //autoComplete="email"
                    //autoFocus
                    value={data?.email}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleSendButton}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isOTPSend ? "Verify Otp" : "Send OTP"}
                </Button>
                <Grid container>
                  <Grid item xs>
                  </Grid>
                  <Grid item>
                    <Link
                      to={"/signup"}
                      style={{
                        textDecoration: "none",
                        color: "inherit"
                      }}
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} light variant="middle">
                  {/* OR */}
                </Divider>
                <Typography align="center" variant="subtitle2" sx={{ mt: 2 }}>
                  By continuing, you agree to{" "}
                  <span style={{ color: "green" }}>Terms of Service</span> and
                  <span style={{ color: "green" }}> Privacy Policy</span>.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
