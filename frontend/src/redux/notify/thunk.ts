import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/axiosConfig";

class NotifyThunk {
    static getFollow() {
        return createAsyncThunk(
            "notify/get",
            async (
                data: { access_token: string; username: string },
                thunkAPI
            ) => {
                const { username, access_token } = data;
                const result = await axiosConfig({
                    isFormData: false,
                    access_token: access_token,
                })({
                    method: "post",
                    url: "/user/get-notify",
                    data: JSON.stringify({
                        username: username,
                    }),
                });
                if (result.status === 200) {
                    return result.data;
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }
}

export default NotifyThunk;
