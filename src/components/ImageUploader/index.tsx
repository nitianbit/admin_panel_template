import React, { useState } from "react";

interface ImageUploadProps {
    multiple?: boolean;
    onChange: (files: File[]) => void;
    width?: number;
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
    text?:string;
    allow?:string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    multiple = false,
    onChange,
    width = 100,
    height = 100,
    maxWidth = 300,
    maxHeight = 300,
    text="Images",
    allow="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}) => {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);

            // Generate previews
            const previews = files.map((file) => URL.createObjectURL(file));
            setPreviews(prev=>[...prev,...previews]);

            // Pass files to parent
            onChange(files);
        }
    };

    const handleRemovePreview = (index: number) => {
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <input
                type="file"
                accept={allow}
                multiple={multiple}
                onChange={handleFileChange}
                style={{ display: "none", width: '100%' }}
                id="image-upload-input"
            />
            <label htmlFor="image-upload-input" style={{ width: '100%' }}>
                <div
                    style={{
                        width: `100%`,
                        height: `${height}px`,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                    }}
                >
                    {previews.length > 0 ? `Add More ${text}` : `Select ${text}`}
                </div>
            </label>

            {/* Preview */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {previews.map((src, index) => (
                    <div key={index} style={{ position: "relative", display: "inline-block", }}>
                        <img
                            src={src}
                            alt={`Preview ${index}`}
                            style={{
                                width: `${width}px`,
                                height: `${height}px`,
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                        <button
                            onClick={() => handleRemovePreview(index)}
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "#ff0000",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
