import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

class PostThunk {
    static addPost() {
        return createAsyncThunk(
            "post/add-post",
            async (formData: FormData, thunkAPI) => {
                const access_token = Cookies.get("access_token");

                if (access_token === "") {
                    return thunkAPI.rejectWithValue("error");
                }

                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/add",
                    {
                        method: "post",
                        body: formData,
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );

                if (result.status === 200) {
                    return result.json();
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }

    static getAllPost() {
        return createAsyncThunk("post/get-all", async (state, thunkAPI) => {
            const access_token = Cookies.get("access_token");
            const result = await fetch(
                process.env.REACT_APP_URL + "/post/get-all",
                {
                    method: "get",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            if (result.status === 200) {
                return result.json();
            }
            return thunkAPI.rejectWithValue("error");
        });
    }

    static like() {
        interface DataPostLike {
            username: string;
            _id: string;
        }
        return createAsyncThunk(
            "post/like",
            async (data: DataPostLike, thunkAPI) => {
                const access_token = Cookies.get("access_token");

                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/like",
                    {
                        method: "post",
                        body: JSON.stringify(data),
                        headers: {
                            Authorization: "Bearer " + access_token,
                            "content-type": "application/json",
                        },
                    }
                );
                if (result.status === 200) {
                    return result.json();
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }

    static addComment() {
        interface DataComment {
            user_id: string;
            content: string;
        }
        const access_token = Cookies.get("access_token");
        return createAsyncThunk(
            "post/add-comment",
            async (data: DataComment, thunkAPI) => {
                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/add-comment",
                    {
                        method: "post",
                        headers: {
                            Authorization: "Bearer " + access_token,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                );
                if (result.status === 200) {
                    return result.json();
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }
    static comment() {
        interface DataComment {
            username: string;
            _id: string;
            content: string;
        }
        return createAsyncThunk(
            "post/comment",
            async (data: DataComment, thunkAPI) => {
                const access_token = Cookies.get("access_token");
                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/comment",
                    {
                        method: "post",
                        headers: {
                            Authorization: "Bearer " + access_token,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                );
                if (result.status === 200) {
                    return result.json();
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }
}

export default PostThunk;
