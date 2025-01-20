import axios from "axios";
import { STORAGE_KEYS, getValue } from '../Storage/index';
import { API_METHODS } from "./constants";

export const api = axios.create({
     baseURL: 'http://139.59.87.79:4030/api',
    //   baseURL: 'http://localhost:4030/api'
    // baseURL: "https://api.apkiproperty.com/api",
    // timeout: 10000,
});

const isFormData = (value: unknown): value is FormData => value instanceof FormData;


const apiHandler = async (endPoint: any, method: string, data = null) => {
    try {
        const contentType: string = isFormData(data) ? "multipart/form-data" : "application/json";
        const response = await api({
            method: method,
            url: endPoint,
            ...(![API_METHODS.GET].includes(method) && { data: data }),
            headers: {
                Authorization: getValue(STORAGE_KEYS.TOKEN),
                "x-api-key": "web",
            },
        });

        return { error: false, message: "", status: response.status, data: response.data };
    } catch (error: any) {
        // Default error message
        let errorMessage = 'An error occurred.';
        let statusCode = 500;

        // Check if the error has a response object (indicating a server-side issue)
        if (error.response) {
            const { status, data } = error.response;
            statusCode = status;

            // Handle different HTTP status codes
            switch (status) {
                case 400:
                    errorMessage = data.message || 'Bad Request: The server could not understand the request.';
                    break;
                case 401:
                    errorMessage = data.message || 'Unauthorized: Authentication is required.';
                    break;
                case 403:
                    errorMessage = data.message || 'Forbidden: You do not have permission to access this resource.';
                    break;
                case 404:
                    errorMessage = data.message || 'Not Found: The requested resource could not be found.';
                    break;
                case 500:
                    errorMessage = data.message || 'Internal Server Error: There is an issue with the server.';
                    break;
                default:
                    errorMessage = data.message || `Unexpected Error: ${status}`;
                    break;
            }
        }
        // If there is no response object, it could be a network error or timeout
        else if (error.request) {
            console.error('No response received:', error.request);
            errorMessage = 'Network Error: No response received from server.';
        }
        // Handle errors related to setting up the request
        else {
            console.error('Error in setting up request:', error.message);
            errorMessage = `Error: ${error.message}`;
        }

        // Return the error message to the caller
        return { error: true, message: errorMessage, status: statusCode, data:{} };
    }
};

export default apiHandler;