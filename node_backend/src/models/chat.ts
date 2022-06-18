import { model, Schema } from "mongoose";
import { User } from "./user";

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

export { ChatModel, GroupModel };
