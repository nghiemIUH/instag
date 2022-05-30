import { Socket, Server } from "socket.io";

const comment_socket = (io: Server, socket: Socket) => {
    const addComment = (payload: any) => {
        console.log(payload.content);

        const { content, post_id, author, date } = payload;
        io.sockets.emit(post_id, { content, post_id, author, date });
    };
    socket.on("add-comment", addComment);
};
export default comment_socket;
