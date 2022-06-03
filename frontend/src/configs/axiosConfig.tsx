import axios, { AxiosInstance } from "axios";

// =====================================
//  AXIOS JSON DATA
const axiosJSON = axios.create({
    baseURL: process.env.PUBLIC_URL as string,
    headers: {
        "content-type": "application/json",
    },
});

axiosJSON.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error.response.data.err)
);

// =============================
//  AXIOS FORM DATA SEND FILE AND IMAGE
const axiosFormData = axios.create({
    baseURL: process.env.PUBLIC_URL as string,
});

axiosFormData.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error.response.data.err)
);

interface Option {
    isFormData: boolean;
    access_token?: string;
}
class AxiosConfig {
    axiosConfig: AxiosInstance;

    constructor() {
        this.axiosConfig = axios.create();
    }
    config({ isFormData, access_token }: Option) {
        this.axiosConfig.interceptors.request.use(
            (config) => {
                if (!isFormData) {
                    config.headers = { "content-type": "application/json" };
                }
                if (access_token) {
                    config.headers = {
                        Authorization: "Bearer " + access_token,
                    };
                }
                config.baseURL = process.env.REACT_APP_URL;
                return config;
            },
            (error) => Promise.reject(error)
        );
        return this.axiosConfig;
    }
}

export { AxiosConfig };
