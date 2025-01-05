import { useState } from "react";
import { doPOST } from "../../utils/HttpUtils";
import { UploadProps } from "../../types/upload";

const UploadFile : React.FC<UploadProps> =  ({module, record_id}) => { 
    const [fileData, setFileData] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileData(event.target.files[0]);
        }
    };

    const uploadFile = async () => {
        if (!fileData) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileData);
        formData.append("module", module);
        formData.append("record_id", record_id);

        try {
            const response = await doPOST("/file/upload", formData);
            console.log(response);
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    return (
        <div>
            <h1>Upload File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
};

export default UploadFile;