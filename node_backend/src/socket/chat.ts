import { Server, Socket } from "socket.io";
import { UserModel } from "../models/user";
import { ChatModel } from "../models/chat";
import { GroupModel } from "../models/chat";

const chat_socket = (io: Server, socket: Socket) => {
    socket.on("message", async ({ content, from, to }) => {
        const user_1 = await UserModel.findOne({ username: from }).select(
            "_id"
        );
        const user_2 = await UserModel.findOne({ username: to }).select("_id");
        const group = await GroupModel.findOne({
            users: { $all: [user_1, user_2] },
        });
        const chat = await ChatModel.create({
            group,
            sender: user_1,
            content,
        });
        io.sockets.to(to).to(from).emit("re-message", {
            chat,
        });
    });
};

export default chat_socket;
