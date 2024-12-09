import axios from "axios";
import { STORAGE_KEYS, getValue } from "../Storage";
import { API_METHODS } from "./constants";

const api = axios.create({
    baseURL: 'http://localhost:5400/api',
    // baseURL: "https://api.apkiproperty.com/api",
    // timeout: 10000,
});

const apiHandler = async (endPoint, method, data = null) => {
    try {
        const response = await api({
            method: method,
            url: endPoint,
            ...(![API_METHODS.GET].includes(method) && { data: data }),
            headers: {
                Authorization: getValue(STORAGE_KEYS.TOKEN),
                "x-api-key": "web",
            },
        });

        return response.data;
    } catch (error) {
        //handle 401 here
        if (error?.response?.status == 401) {
                 localStorage.clear()
                 window.location.pathname = "/"
        }
        if (error.response) {
            console.error("Response Error:", error.response.data);
            throw new Error(error.response.data.message || "Something went wrong");
        } else if (error.request) {
            console.error("Request Error:", error.request);
            throw new Error("Request failed. Please try again later.");
        } else {
            console.error("Error:", error.message);
            throw new Error("An unexpected error occurred. Please try again.");
        }
    }
};

export default apiHandler;
