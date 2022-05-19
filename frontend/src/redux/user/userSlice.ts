import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserInfo } from "../../entities/user";
import { login_thunk } from "./thunk";

interface UserState {
    user: UserInfo;
    access_token: string;
    refresh_token: string;
    loading: boolean;
    error: boolean;
    isLogin: boolean;
}

const initialState = {
    user: {},
    access_token: "",
    refresh_token: "",
    loading: true,
    error: false,
    isLogin: false,
} as UserState;

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state: UserState, action: PayloadAction) => {
            state = initialState;
        },

        getUserReload: (state: UserState, action: PayloadAction) => {
            //
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login_thunk.pending, (state, action) => {
            state.loading = true;
        });

        builder.addCase(
            login_thunk.fulfilled,
            (state, action: PayloadAction<User>) => {
                return {
                    ...state,
                    ...action.payload,
                    loading: false,
                    isLogin: true,
                };
            }
        );

        builder.addCase(login_thunk.rejected, (state, action) => {
            state.error = true;
        });
    },
});

export default userSlice;
