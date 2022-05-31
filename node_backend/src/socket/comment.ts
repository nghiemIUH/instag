import { Socket, Server } from "socket.io";
import { UserModel } from "../models/user";
import { PostModel } from "../models/post";

const comment_socket = (io: Server, socket: Socket) => {
    const addComment = async (payload: any) => {
        const { content, post_id, author, date } = payload;
        const user = await UserModel.findOne({ username: author.username });
        await PostModel.updateOne(
            { _id: post_id },
            { $push: { comments: [{ author: user, content: content }] } }
        );
        io.sockets.emit(post_id, { content, post_id, author, date });
    };
    socket.on("add-comment", addComment);
};
export default comment_socket;
