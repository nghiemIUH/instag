import { createAsyncThunk } from "@reduxjs/toolkit";

interface DataType {
    access_token: string;
    _data?: any;
}

class PostThunk {
    static addPost() {
        return createAsyncThunk(
            "post/add-post",
            async (data: DataType, thunkAPI) => {
                const { _data, access_token } = data;
                if (access_token === "") {
                    return thunkAPI.rejectWithValue("error");
                }

                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/add",
                    {
                        method: "post",
                        body: _data,
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
        return createAsyncThunk(
            "post/get-all",
            async (data: DataType, thunkAPI) => {
                const { access_token } = data;
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
            }
        );
    }

    static like() {
        return createAsyncThunk(
            "post/like",
            async (data: DataType, thunkAPI) => {
                const { access_token, _data } = data;

                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/like",
                    {
                        method: "post",
                        body: JSON.stringify(_data),
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
        return createAsyncThunk(
            "post/add-comment",
            async (data: DataType, thunkAPI) => {
                const { access_token, _data } = data;
                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/add-comment",
                    {
                        method: "post",
                        headers: {
                            Authorization: "Bearer " + access_token,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(_data),
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
        return createAsyncThunk(
            "post/comment",
            async (data: DataType, thunkAPI) => {
                const { access_token, _data } = data;

                const result = await fetch(
                    process.env.REACT_APP_URL + "/post/comment",
                    {
                        method: "post",
                        headers: {
                            Authorization: "Bearer " + access_token,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(_data),
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
