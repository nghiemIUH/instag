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

export { User, UserModel };
