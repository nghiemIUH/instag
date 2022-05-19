import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserInfo } from "../../entities/user";

interface LoginInfo {
    username: string;
    password: string;
}

export const login_thunk = createAsyncThunk(
    "user/login",
    async (userData: LoginInfo, thunkAPI) => {
        const result = await fetch(process.env.REACT_APP_URL + "/user/login", {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (result.status === 200) return result.json();
        return thunkAPI.rejectWithValue("error");
    }
);

export const register_thuk = createAsyncThunk(
    "user/register",
    async (userData: UserInfo, thunkAPI) => {
        const result = await fetch(
            process.env.REACT_APP_URL + "/user/register",
            {
                method: "post",
                headers: { "content-type": "applocation/json" },
                body: JSON.stringify(userData),
            }
        );
        if (result.status === 200) return result.json();
        return thunkAPI.rejectWithValue("err");
    }
);
