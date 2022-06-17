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

// ====================================================

interface FriendShip {
    user_1: User;
    user_2: User;
}

const FriendShipSchema = new Schema<FriendShip>({
    user_1: { type: Schema.Types.ObjectId, ref: "User" },
    user_2: { type: Schema.Types.ObjectId, ref: "User" },
});

const FriendShipModel = model<FriendShip>("FriendShip", FriendShipSchema);

// ====================================================
interface Friend {
    user: User;
    friend: Array<any>;
}

const FriendSchema = new Schema<Friend>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    friend: { type: [Schema.Types.ObjectId], ref: "User" },
});

const FriendModel = model<Friend>("Friend", FriendSchema);

// =====================================================
interface NotifyFriend {
    user: User;
    seen: boolean;
    event: FriendShip;
    date: Date;
}

const NotifyFriendSchema = new Schema<NotifyFriend>({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    seen: { type: Boolean, default: false },
    event: { type: Schema.Types.ObjectId, ref: "FriendShip" },
    date: { type: Schema.Types.Date, default: Date.now },
});

const NotifyFriendModel = model<NotifyFriend>("Notify", NotifyFriendSchema);

// =====================================================
interface Group {
    _id: string;
    users: Array<any>;
}

const GroupSchema = new Schema<Group>({
    users: { type: [Schema.Types.ObjectId], ref: "User" },
});

const GroupModel = model<Group>("Group", GroupSchema);

interface ChatType {
    _id: string;
    group: Group;
    sender: User;
    content: string;
    date: Date;
}

const ChatSchema = new Schema<ChatType>({
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    date: { type: Schema.Types.Date, default: Date.now },
});

const ChatModel = model<ChatType>("Chat", ChatSchema);

export {
    User,
    UserModel,
    GroupModel,
    ChatModel,
    FriendModel,
    NotifyFriendModel,
    FriendShipModel,
};
