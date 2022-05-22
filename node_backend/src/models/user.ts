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
    username: String,
    password: String,
    email: String,
    avatar: String,
    fullName: String,
});

const UserModel = model<User>("User", userSchema);

export { User, UserModel };
