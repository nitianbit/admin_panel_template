import { doGET } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";


export const getAppointmentsCount = async ({filters}: {filters: any}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const url = `${ENDPOINTS.count('appointments')}?${queryParams.toString()}`;
        const response = await doGET(url);
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}

export const getDoctorsCount = async ({filters}: {filters: any}) => {
    try {
        const queryParams = new URLSearchParams(filters);
        const url = `${ENDPOINTS.count('doctors')}?${queryParams.toString()}`;
        const response = await doGET(url);
        return response.data.data;
    } catch (error) {
        console.log(error);
    }
}
