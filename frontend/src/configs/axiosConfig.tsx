import axios, { AxiosRequestHeaders } from "axios";
interface Option {
    isFormData: boolean;
    access_token?: string;
}
const axiosConfig = ({ isFormData, access_token }: Option) => {
    const axiosConfig = axios.create();
    axiosConfig.interceptors.request.use(
        (config) => {
            if (!isFormData) {
                config.headers = { "Content-Type": "application/json" };
            }
            if (access_token) {
                (
                    config.headers as AxiosRequestHeaders
                ).Authorization = `Bearer ${access_token}`;
            }
            config.baseURL = process.env.REACT_APP_URL;
            return config;
        },
        (error) => Promise.reject(error)
    );
    return axiosConfig;
};

export default axiosConfig;
