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
            const user_id = action.payload.user_id;
            const post_id = action.payload.post_id;

            const new_post = [] as Post[];
            for (const value of state.post) {
                if (value._id === post_id) {
                    if (value.likes.includes(user_id)) {
                        const index = value.likes.indexOf(user_id);
                        value.likes.splice(index, 1);
                    } else {
                        value.likes.push(user_id);
                    }
                }
                new_post.push(value);
            }

            return void (state.post = new_post);
        });

        builder.addCase(PostThunk.comment().fulfilled, (state, action) => {
            return state;
        });
    },
});

export default postSlice;
