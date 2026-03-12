import axios from "axios";
import { STORAGE_KEYS, getValue } from '../Storage/index';
import { API_METHODS } from "./constants";

export const api = axios.create({
    // baseURL: 'http://139.59.87.79:4030/api',
    baseURL: 'https://myewacare.com/api/v1'
    // baseURL: 'http://93.127.199.40:4031/api/v1/'

});

const isFormData = (value: unknown): value is FormData => value instanceof FormData;


const apiHandler = async (endPoint: any, method: string, data = null) => {
    try {

        const cleanEndPoint = endPoint.startsWith('/') ? endPoint.substring(1) : endPoint;
        const finalUrl = `${api.defaults.baseURL}${cleanEndPoint}`;
        console.log(`[API Call] ${method} ${finalUrl}`);

        const headers: any = {
            Authorization: `Bearer ${getValue(STORAGE_KEYS.TOKEN)}`,
            "x-api-key": "web",
        };

        if (!isFormData(data)) {
            headers["Content-Type"] = "application/json";
        }

        const response = await api({
            method: method,
            url: cleanEndPoint,
            ...(![API_METHODS.GET,API_METHODS.DELETE].includes(method) && { data: data }),
            headers,
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
            const message = data?.message || data?.error || data?.err;
            switch (status) {
                case 400:
                    errorMessage = message || 'Bad Request: The server could not understand the request.';
                    break;
                case 401:
                    errorMessage = message || 'Unauthorized: Authentication is required.';
                    break;
                case 403:
                    errorMessage = message || 'Forbidden: You do not have permission to access this resource.';
                    break;
                case 404:
                    errorMessage = message || 'Not Found: The requested resource could not be found.';
                    break;
                case 500:
                    errorMessage = message || 'Internal Server Error: There is an issue with the server.';
                    break;
                default:
                    errorMessage = message || `Unexpected Error: ${status}`;
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
        return { error: true, message: errorMessage, status: statusCode, data: {} };
    }
};

export default apiHandler;
