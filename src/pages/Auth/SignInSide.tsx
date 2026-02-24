import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
  phone: string;
  password: string;
};

export default function SignInSide() {

  const { success, error, setIsLoggedIn, isLoggedIn, setIsTokenVerified, setUserData } = useAppContext()

  const [loading, setLoading] = useState(false);
  const [isOTPSend, setIsOTPSend] = useState(false);
  const [data, setData] = useState({
    role: "doctors",
    phone: ""
  });

  const [otp, setOTP] = useState("")

  const [otpData, setOtpData] = React.useState({ otp: ''.padEnd(6, ' ') });

  const navigate = useNavigate();
  const {
    register,
    formState: { errors }
  } = useForm<FormValues>();

  const options = ['doctors', 'laboratories', "admin", 'supervisor', "hr", "marketing", "user"];

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
      if (otp.length != 6) {
        error("Please enter 6 digit OTP")
        return;
      }

      const updatedOTpData = {
        ...otpData,
        otp: otp,
        role: data.role,
        phone: String(data.phone).trim(),
        isTokenRequired: true
      };
      console.log("Verify OTP Payload:", updatedOTpData);
      setOtpData(updatedOTpData)
      const response = await doPOST(AUTHENDPOINTS.verifyotp, updatedOTpData);
      console.log("Verify OTP Full Response:", JSON.stringify(response));
      if (response.status >= 200 && response.status < 300) {
        success("Login Successfully")

        const responseData = response.data?.data || response.data;
        const token = responseData?.token;
        const user = responseData?.user;

        setValue(STORAGE_KEYS.TOKEN, token);

        const userWithRole = {
          ...user,
          role: user?.role || user?.userType || data.role
        };

        setValue(STORAGE_KEYS.USER_DATA, JSON.stringify(userWithRole));
        setUserData(userWithRole);
        setIsLoggedIn(true);
        setIsTokenVerified(true);

        navigate(`/dashboard`);
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
      const sendPayload = {
        ...userData,
        phone: String(userData.phone || data.phone).trim(),
        role: data.role
      };
      console.log("sendOTP Payload:", sendPayload);
      const response = await doPOST(AUTHENDPOINTS.sentotp, sendPayload);
      if (response.status >= 200 && response.status < 300) {
        setIsOTPSend(true)
        const otpInfo = response.data?.data || response.data;
        if (otpInfo) {
          setOtpData((prev: any) => ({
            ...prev,
            otpId: otpInfo.otpId,
            userId: otpInfo.userId || userData?.userId
          }))
        }
        success("OTP Sent Successfully")
      } else if (response.status >= 400 && response.status <= 500) {
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
      if (!data.phone) {
        error("Please enter phone number")
        return;
      }
      const payload = {
        role: data.role,
        phone: String(data.phone).trim()
      };

      console.log("Login Payload:", JSON.stringify(payload));
      const response = await doPOST(AUTHENDPOINTS.login, payload);
      console.log("Login Response:", JSON.stringify(response));
      if (response.status >= 200 && response.status < 300) {
        const responseData = response.data?.data || response.data;
        console.log("Login Response Data:", JSON.stringify(responseData));

        setIsOTPSend(true);
        if (responseData) {
          setOtpData((prev: any) => ({
            ...prev,
            otpId: responseData.otpId,
            userId: responseData.userId || responseData._id
          }));
        }
        success("OTP Sent Successfully");
      } else if (response.status >= 400 && response.status <= 500) {
        error(response.message);
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
      return navigate(`/dashboard`)
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
            sx={{
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                my: { xs: 4, sm: 6, md: 8 },
                px: { xs: 2, sm: 3, md: 4 }, // Use padding instead of margin to prevent overflow
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>

              <Box sx={{
                mt: 1,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                {!isOTPSend && (
                  <Box sx={{
                    mt: 2,
                    mb: 2,
                    width: '100%',
                    overflowX: 'auto',
                    '::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for Chrome/Safari/Opera
                    msOverflowStyle: 'none',  // IE and Edge
                    scrollbarWidth: 'none',  // Firefox
                  }}>
                    <ToggleButton
                      options={options}
                      onSelect={handleRoleSelect}
                      style={{
                        marginTop: 4,
                        // width: '100%', // Remove fixed width to allow natural width + scroll
                        minWidth: 'fit-content', // Ensure it takes necessary space
                      }}
                    />
                  </Box>
                )}

                {isOTPSend ? (
                  <Box sx={{
                    mt: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <OTP
                      separator={<span>-</span>}
                      value={otp}
                      onChange={setOTP}
                      length={6}
                    />
                  </Box>
                ) : (
                  <TextField
                    margin="normal"
                    fullWidth
                    id="phone"
                    label="Phone Number"
                    onChange={(e: any) => {
                      handleChange("phone", e?.target?.value)
                    }}
                    value={data?.phone}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      '& .MuiInputBase-root': {
                        maxWidth: '100%'
                      }
                    }}
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleSendButton}
                  sx={{
                    mt: 3,
                    mb: 2,
                    maxWidth: '100%',
                    wordBreak: 'keep-all',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {isOTPSend ? "Verify OTP" : "Send OTP"}
                </Button>

                <Box sx={{
                  mt: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  width: '100%'
                }}>
                  <Link
                    to={"/signup"}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Box>

                <Divider sx={{ mt: 2 }} light variant="middle" />

                <Typography
                  align="center"
                  variant="subtitle2"
                  sx={{
                    mt: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}
                >
                  By continuing, you agree to{" "}
                  <span style={{ color: "green" }}>Terms of Service</span> and{" "}
                  <span style={{ color: "green" }}>Privacy Policy</span>.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
}
