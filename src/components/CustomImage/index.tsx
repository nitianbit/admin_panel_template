import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalBody } from 'reactstrap';
import { api } from '../../services/api/apiHandler';
import { getValue, STORAGE_KEYS } from '../../services/Storage';
import { Dialog } from '@mui/material';

interface CustomImageProps {
    src: string;
    placeholder?: string;
    style?: React.CSSProperties;
    [key: string]: any; // For additional props
}

const CustomImage: React.FC<CustomImageProps> = ({
    src,
    placeholder = "Loading...",
    style,
    ...restProps
}) => {
    const [imageSrc, setImageSrc] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false); // State to control modal visibility

    const fetchImage = async (src: string) => {
        setLoading(true);
        if (src) {
            try {
                // Build full absolute URL using the origin from the api baseURL
                // api.defaults.baseURL = 'https://myewacare.com/api/v1'
                // Image paths are like '/api/static/general/...' which is NOT under /api/v1/
                // So we extract just the origin and append the src path directly
                const baseURL = api.defaults.baseURL || '';
                const origin = new URL(baseURL).origin; // e.g. 'https://myewacare.com'
                const fullUrl = src.startsWith('http') ? src : `${origin}${src}`;

                const response = await axios.get(fullUrl, {
                    headers: {
                        Authorization: `Bearer ${getValue(STORAGE_KEYS.TOKEN)}`,
                    },
                    withCredentials: false,
                    responseType: "blob",
                });

                const reader = new FileReader();
                reader.onload = () => {
                    setImageSrc(reader.result as string);
                };
                reader.readAsDataURL(response.data);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        if (src) {
            fetchImage(src);
        }
    }, [src]);

    const toggleModal = () => setModal(!modal);

    if (loading) {
        return <div className="image-skeleton mt-0 pt-0" style={{ backgroundColor: "#eee", ...style }}></div>;
    }

    return (
        <div>
            {src && imageSrc ? (
                <>
                    <img
                        key={src}
                        src={imageSrc}
                        alt="Loaded Image"
                        style={{ cursor: 'pointer', ...style }}
                        onClick={toggleModal}
                        {...restProps}
                    />

                    <Dialog
                        open={modal}
                        onClose={toggleModal}
                        fullScreen
                        fullWidth
                        sx={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "& .MuiDialog-paper": { backgroundColor: "black", padding: 0 },
                        }}
                    >
                        <img
                            src={imageSrc}
                            alt="Modal Image"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Dialog>

                </>
            ) : (
                <i className='bx bx-image-alt font-size-20' />
            )}
        </div>
    );
};

export default CustomImage;
