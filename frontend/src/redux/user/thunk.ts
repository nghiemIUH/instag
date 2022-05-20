import { createAsyncThunk } from "@reduxjs/toolkit";
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

export const getNewToken_thunk = createAsyncThunk(
    "user/get-new-token",
    async (refresh_token: string, thunkAPI) => {
        if (refresh_token === "") {
            return thunkAPI.rejectWithValue("error");
        }
        const result = await fetch(
            process.env.REACT_APP_URL + "/user/get-new-token",
            {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ refresh_token }),
            }
        );
        if (result.status === 200) {
            return result.json();
        }
        return thunkAPI.rejectWithValue("error");
    }
);

export const getUserReload_thunk = createAsyncThunk(
    "user/get-user-reload",
    async (refresh_token: string, thunkAPI) => {
        if (refresh_token === "") {
            return thunkAPI.rejectWithValue("error");
        }

        const result = await fetch(
            process.env.REACT_APP_URL + "/user/get-user-reload",
            {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ refresh_token }),
            }
        );
        if (result.status === 200) {
            return result.json();
        }
        return thunkAPI.rejectWithValue("error");
    }
);

export const register_thunk = createAsyncThunk(
    "user/register",
    async (userData: FormData, thunkAPI) => {
        const result = await fetch(
            process.env.REACT_APP_URL + "/user/register",
            {
                method: "post",
                // headers: { "Content-Type": "multipart/form-data" },
                body: userData,
            }
        );
        if (result.status === 200) return result.json();
        return thunkAPI.rejectWithValue("error");
    }
);
