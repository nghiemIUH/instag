import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../entities/user";

const initialState: User = {
    user: undefined,
    access_token: "",
    refresh_token: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state: User, action: PayloadAction<User>) => {
            state = action.payload;
        },
        logout: (state: User, action: PayloadAction<User>) => {
            state = initialState;
        },
    },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
