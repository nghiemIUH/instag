import { createSlice } from "@reduxjs/toolkit";
import NotifyThunk from "./thunk";
import Notifytype from "../../entities/notify";

const initialState = {
    follow: {} as Notifytype,
};

const notifySlice = createSlice({
    name: "notify",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(NotifyThunk.getFollow().fulfilled, (state, action) => {
            state.follow = action.payload.follow;
        });
    },
});

export default notifySlice;
