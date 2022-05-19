import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserInfo } from "../../entities/user";
import { login_thunk } from "./thunk";

const initialState = {
    user: {} as UserInfo,
    access_token: "",
    refresh_token: "",
    loading: true,
    error: false,
    isLogin: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state = initialState, action: PayloadAction) => {
            state = initialState;
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
