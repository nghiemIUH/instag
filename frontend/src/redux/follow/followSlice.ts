import { createSlice } from "@reduxjs/toolkit";
import FollowThunk from "./thunk";
import FollowType from "../../entities/follow";

const initialState = {
    follow: {} as FollowType,
};

const followSlice = createSlice({
    name: "follow",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(FollowThunk.getFollow().fulfilled, (state, action) => {
            state.follow = action.payload.follow;
        });
        builder.addCase(
            FollowThunk.follow_unfollow().fulfilled,
            (state, action) => {
                state.follow = action.payload.new_follow;
            }
        );
    },
});

export default followSlice;
