import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserInfo } from "../../entities/user";
import UserThunk from "./thunk";
import Cookies from "js-cookie";

interface UserState {
    user: UserInfo;
    access_token: string;
    isLogin: boolean;
    error: boolean;
    isRegister: boolean;
    isLoading: boolean;
}

const initialState = {
    user: {} as UserInfo,
    access_token: "",
    isLogin: false,
    error: false,
    isRegister: false,
    isLoading: true,
} as UserState;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state: UserState, action: PayloadAction) => {
            Cookies.remove("refresh_token");
            return { ...initialState, isLogin: false, isLoading: false };
        },
        changeRegister: (state: UserState, action: PayloadAction) => {
            state.isRegister = false;
        },
        renewAccessToken: (state: UserState, action: PayloadAction<any>) => {
            state.access_token = action.payload.access_token;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(UserThunk.login().pending, (state, action) => {
            return {
                ...state,
                isLoading: true,
            };
        });
        builder.addCase(
            UserThunk.login().fulfilled,
            (state: UserState, action: PayloadAction<User>) => {
                Cookies.set("refresh_token", action.payload.refresh_token);
                state.isLogin = true;
                state.error = false;
                state.isLoading = false;
                state.access_token = action.payload.access_token;
                state.user = action.payload.user;
            }
        );

        builder.addCase(UserThunk.login().rejected, (state, action) => {
            state.error = true;
        });

        builder.addCase(UserThunk.getNewToken().fulfilled, (state, action) => {
            state.access_token = action.payload.access_token;
            state.isLogin = true;
            state.error = false;
        });

        builder.addCase(UserThunk.getNewToken().rejected, (state, action) => {
            Cookies.set("refresh_token", "");
            return initialState;
        });

        builder.addCase(UserThunk.getUserReload().pending, (state, action) => {
            state.isLoading = true;
            state.isLogin = true;
        });

        builder.addCase(
            UserThunk.getUserReload().fulfilled,
            (state, action) => {
                state.isLogin = true;
                state.error = false;
                state.access_token = action.payload.access_token;
                state.user = action.payload.user;
                state.isLoading = false;
            }
        );

        builder.addCase(UserThunk.getUserReload().rejected, (state, action) => {
            return { ...initialState, isLogin: false, isLoading: false };
        });

        builder.addCase(UserThunk.register().fulfilled, (state, action) => {
            state.isRegister = true;
            state.error = false;
        });

        builder.addCase(UserThunk.register().rejected, (state, action) => {
            state.isRegister = false;
        });

        builder.addCase(UserThunk.update().fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.error = false;
        });

        builder.addCase(UserThunk.update().rejected, (state, action) => {
            state.error = true;
        });
    },
});

export const { logout, changeRegister, renewAccessToken } = userSlice.actions;
export default userSlice;
