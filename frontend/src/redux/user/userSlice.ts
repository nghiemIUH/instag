import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserInfo } from "../../entities/user";
import {
    login_thunk,
    getNewToken_thunk,
    getUserReload_thunk,
    register_thunk,
} from "./thunk";
import Cookies from "js-cookie";

interface UserState {
    user: UserInfo;
    access_token: string;
    refresh_token: string;
    isLogin: boolean;
    error: boolean;
    isRegister: boolean;
}

const initialState = {
    user: {} as UserInfo,
    access_token: "",
    refresh_token: "",
    isLogin: false,
    error: false,
    isRegister: false,
} as UserState;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state: UserState, action: PayloadAction) => {
            Cookies.set("access_token", "");
            Cookies.set("refresh_token", "");
            return initialState;
        },
        changeRegister: (state: UserState, action: PayloadAction) => {
            state.isRegister = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            login_thunk.fulfilled,
            (state, action: PayloadAction<User>) => {
                Cookies.set("access_token", action.payload.access_token);
                Cookies.set("refresh_token", action.payload.refresh_token);

                return {
                    ...state,
                    ...action.payload,
                    isLogin: true,
                    error: false,
                };
            }
        );

        builder.addCase(login_thunk.rejected, (state, action) => {
            state.error = true;
        });

        builder.addCase(getNewToken_thunk.fulfilled, (state, action) => {
            state.access_token = action.payload.access_token;
            state.isLogin = true;
            state.error = false
            Cookies.set("access_token", action.payload.access_token);
        });

        builder.addCase(getNewToken_thunk.rejected, (state, action) => {
            Cookies.set("access_token", "");
            Cookies.set("refresh_token", "");
            return initialState;
        });

        builder.addCase(getUserReload_thunk.fulfilled, (state, action) => {
            state.access_token = action.payload.access_token;
            state.user = action.payload.user;
            state.refresh_token = Cookies.get("refresh_token") as string;
            state.isLogin = true;
            state.error = false

        });

        builder.addCase(getUserReload_thunk.rejected, (state, action) => {
            Cookies.set("access_token", "");
            Cookies.set("refresh_token", "");
            return initialState;
        });

        builder.addCase(register_thunk.fulfilled, (state, action) => {
            state.isRegister = true;
            state.error = false

        });

        builder.addCase(register_thunk.rejected, (state, action) => {
            state.isRegister = false;
        });
    },
});

export const { logout, changeRegister } = userSlice.actions;
export default userSlice;
