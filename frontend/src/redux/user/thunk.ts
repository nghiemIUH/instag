import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/axiosConfig";
interface LoginInfo {
    username: string;
    password: string;
}

interface AuthType {
    data: FormData;
    access_token: string;
}

export default class UserThunk {
    static login() {
        return createAsyncThunk(
            "user/login",
            async (userData: LoginInfo, thunkAPI) => {
                const result = await axiosConfig({ isFormData: false })({
                    method: "post",
                    url: "/user/login",
                    data: JSON.stringify(userData),
                });
                if (result.status === 200) return result.data;
                return thunkAPI.rejectWithValue("error");
            }
        );
    }

    static getUserReload() {
        return createAsyncThunk(
            "user/get-user-reload",
            async (refresh_token: string, thunkAPI) => {
                if (refresh_token.length === 0) {
                    return thunkAPI.rejectWithValue("error");
                }

                const result = await axiosConfig({ isFormData: false })({
                    method: "post",
                    url: "/user/get-user-reload",
                    data: JSON.stringify({ refresh_token }),
                });

                if (result.status === 200) {
                    return result.data;
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }

    static register() {
        return createAsyncThunk(
            "user/register",
            async (userData: FormData, thunkAPI) => {
                const result = await axiosConfig({ isFormData: true })({
                    method: "post",
                    url: "/user/register",
                    data: userData,
                });

                if (result.status === 200) return result.data;
                return thunkAPI.rejectWithValue("error");
            }
        );
    }

    static getNewToken() {
        return createAsyncThunk(
            "user/get-new-token",
            async (refresh_token: string, thunkAPI) => {
                if (refresh_token === "") {
                    return thunkAPI.rejectWithValue("error");
                }
                const result = await axiosConfig({ isFormData: false })({
                    method: "post",
                    url: "/user/get-new-token",
                    data: JSON.stringify({ refresh_token }),
                });
                if (result.status === 200) {
                    return result.data;
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }

    static update() {
        return createAsyncThunk(
            "user/update",
            async (new_data: AuthType, thunkAPI) => {
                const { data, access_token } = new_data;
                const result = await axiosConfig({
                    isFormData: true,
                    access_token: access_token,
                })({
                    method: "post",
                    url: "/user/update",
                    data: data,
                });

                if (result.status === 200) return result.data;
                return thunkAPI.rejectWithValue("error");
            }
        );
    }
}
