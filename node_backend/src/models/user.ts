import { model, Schema } from "mongoose";

interface User {
    id?: string;
    username: string;
    password: string;
    email: string;
    avatar: string;
    fullName: string;
}

const userSchema = new Schema<User>({
    username: { type: String },
    password: String,
    email: String,
    avatar: String,
    fullName: { type: String },
});

userSchema.index({ username: "text", fullName: "text" });
const UserModel = model<User>("User", userSchema);

interface Follow {
    user: User;
    followers: Array<any>;
    followings: Array<any>;
}

const followSchema = new Schema<Follow>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    followers: { type: [Schema.Types.ObjectId], ref: "User" },
    followings: { type: [Schema.Types.ObjectId], ref: "User" },
});

const FollowModel = model<Follow>("Follow", followSchema);

export { User, UserModel, FollowModel };
