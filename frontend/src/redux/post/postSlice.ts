import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../entities/post";
import PostThunk from "./thunk";

const initialState = {
    post: [] as Post[],
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(PostThunk.addPost().fulfilled, (state, action) => {
            return state;
        });

        builder.addCase(
            PostThunk.getAllPost().fulfilled,
            (state, action: PayloadAction<[Post]>) => {
                state.post = action.payload;
            }
        );

        builder.addCase(PostThunk.like().fulfilled, (state, action) => {
            return { ...state };
        });
    },
});

export default postSlice;
