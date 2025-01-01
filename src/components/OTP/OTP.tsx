import * as React from 'react';
import Input from '@mui/base/Input';
import { Box, styled } from '@mui/system';

interface OTPProps {
    separator: React.ReactNode;
    length: number;
    value: string;
    onChange: any;
}

interface OTPInputProps {
    setOtpData: any;
    otpData:any
}


export const OTP: React.FC<OTPProps> = ({ separator, length, value, onChange }) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

    const focusInput = (targetIndex: number) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput?.focus();
    };

    const selectInput = (targetIndex: number) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput?.select();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < length - 1) {
                    focusInput(currentIndex + 1);
                    selectInput(currentIndex + 1);
                }
                break;
            case 'Backspace':
            case 'Delete':
                event.preventDefault();
                onChange((prevOtp: string) => {
                    const otpArray = prevOtp.split('');
                    otpArray[currentIndex] = '';
                    return otpArray.join('');
                });
                if (event.key === 'Backspace' && currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            default:
                break;
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, currentIndex: number) => {
        const newValue = event.target.value;
        if (newValue.length > 0) {
            onChange((prevOtp: string) => {
                const otpArray = prevOtp.split('');
                otpArray[currentIndex] = newValue.slice(-1); // Keep only the last character
                return otpArray.join('');
            });
            if (currentIndex < length - 1) {
                focusInput(currentIndex + 1);
            }
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text/plain').slice(0, length);
        onChange(pastedData.padEnd(length, ' '));
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: "center", mt: 2 }}>
            {Array.from({ length }).map((_, index) => (
                <React.Fragment key={index}>
                    <Input
                        slots={{
                            input: InputElement,
                        }}
                        type='number'
                        aria-label={`Digit ${index + 1} of OTP`}
                        slotProps={{
                            input: {
                                ref: (el: HTMLInputElement | null) => {
                                    inputRefs.current[index] = el;
                                },
                                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index),
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index),
                                onPaste: handlePaste,
                                value: value[index] || '',
                                inputMode: 'numeric',
                            },
                        }}
                    />
                    {index < length - 1 && separator}
                </React.Fragment>
            ))}
        </Box>
    );
};

const OTPInput: React.FC<OTPInputProps> = ({otpData, setOtpData }) => {

    const handleOtpChange = (otp: string) => {
        setOtpData((prevState:any) => ({
            ...prevState,
            otp: otp,
        }));
    };


    return (
        <OTP separator={<span>-</span>} value={otpData.otp} onChange={handleOtpChange} length={4} />
    );
};

export default OTPInput;

const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const InputElement = styled('input')(
    ({ theme }) => `
  width: 40px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 0;
  border-radius: 8px;
  text-align: center;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
        };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  /* firefox */
  &:focus-visible {
    outline: 0;
  }
`,
);