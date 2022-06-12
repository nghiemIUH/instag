import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import postSlice from "./post/postSlice";
import followSlice from "./follow/followSlice";

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        post: postSlice.reducer,
        follow: followSlice.reducer,
    },
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
