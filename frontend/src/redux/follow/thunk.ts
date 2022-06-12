import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/axiosConfig";

class FollowThunk {
    static getFollow() {
        return createAsyncThunk(
            "follow/get-follow",
            async (
                data: { access_token: string; username: string },
                thunkAPI
            ) => {
                const { username, access_token } = data;
                const result = await axiosConfig({
                    isFormData: false,
                    access_token: access_token,
                })({
                    method: "post",
                    url: "/user/get-follow",
                    data: JSON.stringify({
                        username: username,
                    }),
                });
                if (result.status === 200) {
                    return result.data;
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }
    static follow_unfollow() {
        return createAsyncThunk(
            "follow/follow-unfollow",
            async (
                data: {
                    access_token: string;
                    current_username: string;
                    other_username: string;
                },
                thunkAPI
            ) => {
                const { access_token, current_username, other_username } = data;
                const result = await axiosConfig({
                    isFormData: false,
                    access_token: access_token,
                })({
                    method: "post",
                    url: "/user/follow",
                    data: JSON.stringify({
                        current_username,
                        other_username,
                    }),
                });
                if (result.status === 200) {
                    return result.data;
                }
                return thunkAPI.rejectWithValue("error");
            }
        );
    }
}

export default FollowThunk;
